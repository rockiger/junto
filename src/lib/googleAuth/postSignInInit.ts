import { mergeHintData } from 'components/gsuite-components/hint'
import { createFile, createNewWiki } from 'db'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'
import {
	downloadFile,
	getFolderId,
	listAppDataFiles,
	listFilesChunked as listFiles,
	refreshSession,
	updateFile,
} from 'lib/gdrive'
import { isUndefined } from 'lodash'
import { getGlobal, setGlobal } from 'reactn'

import { getUserId } from './userInfo'

let postSignInInitStarted = false

export function resetPostSignInInit() {
	postSignInInitStarted = false
}

async function initFiles() {
	setGlobal({
		isFileListLoading: true,
		isInitialFileListLoading: true,
	})

	const rootFolderId = await getFolderId()
	if (rootFolderId) {
		try {
			const files = await listFiles()
			setGlobal({
				files: [],
				initialFiles: files,
				isFileListLoading: false,
				rootFolderId,
				isInitialFileListLoading: false,
			})
		} catch (err: unknown) {
			const error = err as { body?: string; message?: string }
			const body = error.body ? JSON.parse(error.body) : {}
			const apiError = body.error as { message?: string } | undefined
			if (apiError?.message === 'Invalid Credentials') {
				try {
					await refreshSession()
					await initFiles()
				} catch (refreshError) {
					const message =
						refreshError instanceof Error
							? refreshError.message
							: String(refreshError)
					alert(`Couldn't refresh session: ${message}`)
				}
			} else {
				alert(`Couldn't load files ${String(err)}`)
			}
		}
		return
	}

	const newRootFolderId = await createNewWiki({})
	if (!newRootFolderId) {
		throw new Error('Failed to create root wiki folder')
	}
	await createFile(OVERVIEW_NAME, newRootFolderId, OVERVIEW_VALUE)
	await initFiles()
}

async function initHints() {
	const appDataFolderList = await listAppDataFiles()
	const hintsProps = appDataFolderList.find(
		(file: { name?: string; id: string }) => file.name === 'hints.json',
	)
	const hintsModule = await import('lib/constants/hints')
	const { hints } = hintsModule

	if (isUndefined(hintsProps)) {
		const hintsFileId = await createFile('hints.json', 'appDataFolder', false)
		if (!hintsFileId) {
			throw new Error('Failed to create hints file')
		}
		await updateFile(hintsFileId, {}, false)
		setGlobal({ hints, hintsFileId })
		return
	}

	const hintsAppData = JSON.parse(await downloadFile(hintsProps.id))
	setGlobal({
		hints: mergeHintData(hints, hintsAppData),
		hintsFileId: hintsProps.id,
	})
}

function initUser() {
	try {
		const userId = getUserId()
		setGlobal({ userId })
	} catch (error) {
		console.error("Couldn't get userId", error)
	}
}

export async function runPostSignInInit() {
	if (postSignInInitStarted || getGlobal().isFileListLoading) {
		return
	}

	postSignInInitStarted = true

	try {
		initUser()
		await initFiles()
		await initHints()
	} catch (error) {
		postSignInInitStarted = false
		throw error
	}
}
