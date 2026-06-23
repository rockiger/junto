import { FOLDER_NAME } from 'lib/constants'

export async function checkForFulcrumFolder(parent: string) {
    try {
        const response = await gapi.client!.drive.files.list({
            q: `name = '${FOLDER_NAME}' and '${parent}' in parents`,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: 'files(*)',
        })
        const body = JSON.parse(response.body)
        if (body.files.length > 0) return true
    } catch (err: unknown) {
        const apiErr = err as { body?: string }
        console.log(apiErr.body)
    }
    return false
}

export async function getAllFulcrumFolderInSharedDrive(_name = FOLDER_NAME) {
    try {
        const response = await gapi.client!.drive.files.list({
            q: `name="Fulcrum Documents" and mimeType = "application/vnd.google-apps.folder"`,
            includeItemsFromAllDrives: true,
            fields: 'nextPageToken, files(*)',
            supportsAllDrives: true,
        })
        const body = JSON.parse(response.body)
        const files = body.files.filter(
            (el: { teamDriveId?: string }) => !!el.teamDriveId,
        )
        return files
    } catch (err) {
        console.log(err)
    }
}
