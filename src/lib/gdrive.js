const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files'
const gapi = window.gapi

// 'id' is driveId - unique file id on google drive
// 'version' is driveVersion - version of file on google drive
// 'name' name of the file on google drive
// 'appProperties' keep the custom `ifid` field
const fileFields = 'id,version,name,modifiedByMeTime'
// const fileFields = '*'

function formatFileDescription(response) {
    response = response || null
    if (response && !response.error) {
        return {
            driveId: response.id,
            driveVersion: response.version,
            name: response.name,
            ifid: '',
        }
    } else {
        return {
            driveId: '',
            driveVersion: -1,
            name: '',
            ifid: '',
        }
    }
}

let clientLoaded = false

/**
 * Loads the client. When ready isLoaded() will return true.
 * Never rejects
 *
 * @method init
 * @return {Promise}
 */
export function isLoaded() {
    return clientLoaded
}

/**
 * Loads the client. When ready isLoaded() will return true.
 * Never rejects
 *
 * @method init
 * @return {Promise}
 */
export function init() {
    return new Promise(resolve => {
        gapi.load('client', () =>
            gapi.client.load('drive', 'v3', () => {
                clientLoaded = true
                resolve()
            })
        )
    })
}

/**
 * Get all stories available on the Google Drive. Never rejects
 *
 * @method listFiles
 * @return {Promise|Array} A promise of the result that
 * returns an array of file descriptions:
 * [{driveId, driveVersion, name, ifid}]
 */
export function listFiles(searchTerm = '') {
    function formatResult(response) {
        var stories = []
        for (var i = 0; i < response.files.length; i++) {
            const file = response.files[i]
            //stories.push(formatFileDescription(file));
            stories.push(file)
        }
        return stories
    }

    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .list({
                pageSize: 300,
                fields: 'files(' + fileFields + ')',
                q: `fullText contains '${searchTerm}' and trashed=false`,
            })
            .execute(response => resolve(formatResult(response)))
    })
}

/**
 * Creates file with name and a parentId.
 *
 * @method createFile
 * @param {String} name Name of the new file on Google Drive
 * @param {String} parentId Id of the parent where the file should be
 * 							created, needs to be a folder
 * @return {String} An id of the created file
 * a file description: {driveId, driveVersion, name, ifid}
 */
export async function createFile(name, parentId) {
    const fileMetadata = {
        name: name,
        mimeType: 'text/json',
        parents: [parentId],
    }
    try {
        const response = await window.gapi.client.drive.files.create({
            resource: fileMetadata,
        })
        console.log(response)

        return response.result.id
    } catch (err) {
        console.log(err)
    }
}

/**
 * Creates a new (wiki) folder in the base directory
 *
 * @method createFile
 * @param {String} name Name of the new wiki on Google Drive
 * @return {String} An id of the created file
 * a file description: {driveId, driveVersion, name, ifid}
 */
export async function createNewWiki(name = 'Awiki Documents') {
    const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
    }
    try {
        const result = await window.gapi.client.drive.files.create({
            resource: fileMetadata,
        })
        console.log(result)

        return JSON.parse(result.body).id
    } catch (err) {
        console.log(err)
    }
}

/**
 * Creates file with name and uploads data. Never rejects
 *
 * @method createFileWithContent
 * @param {String} name Name of the new file on Google Drive
 * @param {String} ifid Interactive Fiction Identifier. Internal id
 * @param {String} data Data to put into the file
 * @return {Promise|Object} A promise of the result that returns
 * a file description: {driveId, driveVersion, name, ifid}
 */
export function createFileWithContent(name, ifid, data) {
    // TODO get rid of ifid
    // Current version of gapi.client.drive is not capable of
    // uploading the file so we'll do it with more generic
    // interface. This will create file with given name and
    // properties in one request with multipart request.

    // Some random string that is unlikely to be in transmitted data:
    const boundary = '-batch-31415926579323846boundatydnfj111'
    const delimiter = '\r\n--' + boundary + '\r\n'
    const close_delim = '\r\n--' + boundary + '--'

    const metadata = {
        mimeType: 'Content-Type: text/json',
        name: name,
        appProperties: { ifid: ifid },
    }

    const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/xml\r\n\r\n' +
        data +
        close_delim

    return new Promise((resolve, reject) => {
        gapi.client
            .request({
                path: driveUploadPath,
                method: 'POST',
                params: {
                    uploadType: 'multipart',
                    fields: fileFields,
                },
                headers: {
                    'Content-Type':
                        'multipart/related; boundary="' + boundary + '"',
                },
                body: multipartRequestBody,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                error => resolve(formatFileDescription())
            )
    })
}

/**
 * Get the file description. Never rejects
 *
 * @method getFileDescription
 * @param {String} driveId Google Drive file identifier
 * @return {Promise|Object} A promise of the result that returns
 * a file description: {driveId, driveVersion, name, ifid}
 */
export function getFileDescription(driveId) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .get({
                fileId: driveId,
                fields: fileFields,
            })
            .execute(response => resolve(formatFileDescription(response)))
    })
}

/**
 * Get the file description. Never rejects
 *
 * @method getFolderId
 * @param {string} the name of the folder
 * @return {String} The driveId of the A promise of the result that returns
 * a file'sid: {driveId, driveVersion, name, ifid}
 */
export async function getFolderId(name = 'Awiki Documents') {
    try {
        const result = await gapi.client.drive.files.list({
            q: `name="${name}"`,
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        })
        console.log(result)
        const resultBody = JSON.parse(result.body)
        if (resultBody.files.length > 0) return resultBody.files[0].id
    } catch (err) {
        console.log(err)
    }
}

/**
 * Downloads the content of the file. Can reject
 *
 * @method downloadFile
 * @param {String} driveId Google Drive file identifier
 * @return {Promise|String} A promise of the result that returns
 * a file data string
 */
export function downloadFile(driveId) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .get({
                fileId: driveId,
                alt: 'media',
            })
            .then(data => resolve(data.body), reject)
    })
}

/**
 * Changes the name of the file on Google Drive. Can reject
 *
 * @method renameFile
 * @param {String} driveId Google Drive file identifier
 * @param {String} newName New name that will be displayed in drive
 * @return {Promise|Object} A promise of the result that returns
 * a file description: {driveId, driveVersion, name, ifid}
 */
export function renameFile(driveId, newName) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .update({
                fileId: driveId,
                name: newName,
                fields: fileFields,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                reject
            )
    })
}

/**
 * Removes file completely from drive. Can reject
 *
 * @method deleteFile
 * @param {String} driveId Google Drive file identifier
 * @return {Promise} A promise of the result
 */
export function deleteFile(driveId) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .delete({
                fileId: driveId,
            })
            .then(resolve, reject)
    })
}

/**
 * Replaces the file content with newData. Can reject
 *
 * @method updateFile
 * @param {String} driveId Google Drive file identifier
 * @param {String} newData Data to put into the file
 * @return {Promise|Object} A promise of the result that returns
 * a story description: {driveId, driveVersion, name, ifid}
 */
export function updateFile(driveId, newData) {
    return new Promise((resolve, reject) => {
        gapi.client
            .request({
                path: driveUploadPath + '/' + driveId,
                method: 'PATCH',
                params: { uploadType: 'media', fields: fileFields },
                body: newData,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                reject
            )
    })
}
