import { FOLDER_NAME } from 'lib/constants'

declare const gapi

export async function checkForFulcrumFolder(parent) {
    try {
        const response = await gapi.client.drive.files.list({
            q: `name = '${FOLDER_NAME}' and '${parent}' in parents`,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: 'files(*)',
        })
        const body = JSON.parse(response.body)
        if (body.files.length > 0) return true
    } catch (err) {
        console.log(err)
    }
    return false
}

export async function getAllFulcrumFolderInSharedDrive(name = FOLDER_NAME) {
    try {
        const response = await gapi.client.drive.files.list({
            q: `name="Fulcrum Documents" and mimeType = "application/vnd.google-apps.folder"`,
            includeItemsFromAllDrives: true,
            fields: 'nextPageToken, files(*)',
            supportsAllDrives: true,
        })
        const body = JSON.parse(response.body)
        const files = body.files.filter(el => (el.teamDriveId ? true : false))
        return files
    } catch (err) {
        console.log(err)
    }
}
