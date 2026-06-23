import { getParentFolderId } from 'components/Sidebar/Sidebar-helper'
import { getGapi } from 'lib/gdrive/ensureGapi'
import {
	downloadFile,
	refreshSession,
	updateFileMultipart,
	uploadBinaryFile,
} from 'lib/gdrive'
import type { IFile } from 'reactn/default'

export function slugifyPageFileName(driveFileName: string): string {
	const base = driveFileName.replace(/\.md$/i, '').trim()
	const slug = base
		.toLowerCase()
		.replace(/[^\w.-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
	return slug || 'page'
}

export function generateExcalidrawFileName(pageDriveFileName: string): string {
	const slug = slugifyPageFileName(pageDriveFileName)
	const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
	return `${slug}-${hash}.excalidraw.json`
}

export function getSvgFileName(jsonFileName: string): string {
	return jsonFileName.replace(/\.excalidraw\.json$/i, '.excalidraw.svg')
}

export function findFileInParent(
	fileName: string,
	parentId: string,
	files: IFile[],
): IFile | undefined {
	return files.find(
		(f) =>
			f.name === fileName &&
			f.parents?.[0] === parentId &&
			!f.trashed,
	)
}

function escapeDriveQueryValue(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function resolveExcalidrawDriveFileId(
	fileName: string,
	pageFileId: string,
	files: IFile[],
): Promise<string | null> {
	const parentId = getParentFolderId(pageFileId, files)
	const found = findFileInParent(fileName, parentId, files)
	if (found) return found.id

	await refreshSession()
	const safeName = escapeDriveQueryValue(fileName)
	const response = await getGapi().client!.drive.files.list({
		q: `name='${safeName}' and '${parentId}' in parents and trashed=false`,
		fields: 'files(id,name,parents)',
		supportsAllDrives: true,
		includeItemsFromAllDrives: true,
		pageSize: 1,
	})
	const body = JSON.parse(response.body) as { files?: Array<{ id: string }> }
	return body.files?.[0]?.id ?? null
}

export async function downloadExcalidrawScene(
	driveFileId: string,
): Promise<string> {
	return downloadFile(driveFileId)
}

export async function resolveAndDownloadExcalidrawScene({
	fileName,
	pageFileId,
	files,
	driveFileId = null,
}: {
	fileName: string
	pageFileId: string
	files: IFile[]
	driveFileId?: string | null
}): Promise<{ driveFileId: string; sceneJson: string } | null> {
	let jsonDriveId = driveFileId
	if (!jsonDriveId) {
		jsonDriveId = await resolveExcalidrawDriveFileId(
			fileName,
			pageFileId,
			files,
		)
	}
	if (!jsonDriveId) return null
	const sceneJson = await downloadExcalidrawScene(jsonDriveId)
	return { driveFileId: jsonDriveId, sceneJson }
}

function stubFile(
	id: string,
	name: string,
	parentId: string,
	mimeType: string,
): IFile {
	return {
		id,
		name,
		parents: [parentId],
		mimeType: mimeType as IFile['mimeType'],
		capabilities: {},
		trashed: false,
	}
}

async function uploadOrUpdateBinary({
	content,
	driveFileId,
	fileName,
	mimeType,
	parentId,
}: {
	content: string
	driveFileId?: string | null
	fileName: string
	mimeType: string
	parentId: string
}): Promise<{ driveFileId: string; file: IFile }> {
	if (driveFileId) {
		await updateFileMultipart(driveFileId, content, { mimeType })
		return {
			driveFileId,
			file: stubFile(driveFileId, fileName, parentId, mimeType),
		}
	}

	const file = new File([content], fileName, { type: mimeType })
	const uploaded = (await uploadBinaryFile({
		file,
		parentId,
		name: fileName,
	})) as IFile
	return { driveFileId: uploaded.id, file: uploaded }
}

export async function uploadExcalidrawDrawing({
	json,
	svg,
	jsonFileName,
	jsonDriveFileId,
	svgDriveFileId,
	pageFileId,
	files,
}: {
	json: string
	svg: string
	jsonFileName: string
	jsonDriveFileId?: string | null
	svgDriveFileId?: string | null
	pageFileId: string
	files: IFile[]
}): Promise<{
	jsonDriveFileId: string
	jsonFile: IFile
	svgDriveFileId: string
	svgFile: IFile
}> {
	const parentId = getParentFolderId(pageFileId, files)
	const svgFileName = getSvgFileName(jsonFileName)

	const jsonResult = await uploadOrUpdateBinary({
		content: json,
		driveFileId: jsonDriveFileId,
		fileName: jsonFileName,
		mimeType: 'application/json',
		parentId,
	})
	const existingJson = files.find((f) => f.id === jsonResult.driveFileId)
	if (existingJson) jsonResult.file = existingJson

	const svgResult = await uploadOrUpdateBinary({
		content: svg,
		driveFileId: svgDriveFileId,
		fileName: svgFileName,
		mimeType: 'image/svg+xml',
		parentId,
	})
	const existingSvg = files.find((f) => f.id === svgResult.driveFileId)
	if (existingSvg) svgResult.file = existingSvg

	return {
		jsonDriveFileId: jsonResult.driveFileId,
		jsonFile: jsonResult.file,
		svgDriveFileId: svgResult.driveFileId,
		svgFile: svgResult.file,
	}
}

/** Upload only the SVG companion (legacy backfill). */
export async function uploadExcalidrawSvgOnly({
	svg,
	jsonFileName,
	svgDriveFileId,
	pageFileId,
	files,
}: {
	svg: string
	jsonFileName: string
	svgDriveFileId?: string | null
	pageFileId: string
	files: IFile[]
}): Promise<{ svgDriveFileId: string; svgFile: IFile }> {
	const parentId = getParentFolderId(pageFileId, files)
	const svgFileName = getSvgFileName(jsonFileName)
	const svgResult = await uploadOrUpdateBinary({
		content: svg,
		driveFileId: svgDriveFileId,
		fileName: svgFileName,
		mimeType: 'image/svg+xml',
		parentId,
	})
	const existingSvg = files.find((f) => f.id === svgResult.driveFileId)
	return {
		svgDriveFileId: svgResult.driveFileId,
		svgFile: existingSvg ?? svgResult.file,
	}
}
