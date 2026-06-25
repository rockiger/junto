import { mergeHintData } from 'components/gsuite-components/hint'
import { createFile, createNewWiki } from 'db'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'
import {
	downloadFile,
	getFolderId,
	listAppDataFiles,
	listFilesChunked as listFiles,
	updateFile,
} from 'lib/gdrive'
import {
	findGwikiFiles,
	migrateGwikiFiles,
} from 'lib/migration/migrateGwikiFiles'
import { queryClient } from 'lib/query/query-client'
import { queryKeys } from 'lib/query/query-keys'
import { isUndefined } from 'lodash'
import { setAppState } from 'store/app-store'

let postSignInInitStarted = false

export function resetPostSignInInit() {
	postSignInInitStarted = false
}

async function initFiles() {
	const rootFolderId = await getFolderId()
	if (rootFolderId) {
		try {
			let files = await listFiles()
			files = await migrateLegacyGwikiFiles(files)
			queryClient.setQueryData(queryKeys.filesTree, files)
			queryClient.setQueryData(queryKeys.rootFolderId, rootFolderId)
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err)
			alert(`Couldn't load files: ${message}`)
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

/**
 * One-time batch migration of legacy Slate `.gwiki` files to Markdown.
 * Runs whenever the loaded file list still contains `.gwiki` files and
 * returns a freshly loaded list afterwards.
 */
async function migrateLegacyGwikiFiles(
	files: Awaited<ReturnType<typeof listFiles>>,
) {
	const targets = findGwikiFiles(files)
	if (targets.length === 0) {
		return files
	}

	console.log(`Migrating ${targets.length} .gwiki file(s) to Markdown`)
	setAppState({
		migration: { done: 0, running: true, total: targets.length },
	})
	try {
		const result = await migrateGwikiFiles(targets, (done, total) =>
			setAppState({ migration: { done, running: true, total } }),
		)
		if (result.failed.length > 0) {
			alert(
				`${result.failed.length} page(s) couldn't be converted to Markdown. They were skipped – reloading the page will retry.`,
			)
		}
		return await listFiles()
	} finally {
		setAppState({ migration: null })
	}
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
		setAppState({ hints, hintsFileId })
		return
	}

	const hintsAppData = JSON.parse(await downloadFile(hintsProps.id))
	setAppState({
		hints: mergeHintData(hints, hintsAppData),
		hintsFileId: hintsProps.id,
	})
}

export async function runPostSignInInit() {
	if (postSignInInitStarted) {
		return
	}

	postSignInInitStarted = true

	try {
		await initFiles()
		await initHints()
	} catch (error) {
		postSignInInitStarted = false
		throw error
	}
}
