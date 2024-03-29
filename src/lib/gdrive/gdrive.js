const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files'
const gapi = window.gapi

// 'id' is driveId - unique file id on google drive
// 'version' is driveVersion - version of file on google drive
// 'name' name of the file on google drive
// 'appProperties' keep the custom `ifid` field

const fileFields =
    'capabilities,description,id,name,mimeType,modifiedByMeTime,modifiedTime,shared,ownedByMe,parents,properties,trashed,viewedByMeTime'
/* const fileFields = '*' */

function formatFileDescription(response) {
    response = response || null
    if (response && !response.error) {
        return response
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
 * @return {boolean}
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
 * @method listAppDataFiles
 * @return {Promise|Array} A promise of the result that
 * returns an array of file descriptions:
 * [{driveId, driveVersion, name, ifid}]
 */
export function listAppDataFiles() {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .list({
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
                pageSize: 100,
            })
            .execute(response => resolve(formatResult(response)))
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
export function listFiles(searchTerm = '', orderBy = '') {
    let order = ''
    let q = `fullText contains '${searchTerm}' or name contains '${searchTerm}' and trashed=false`
    if (!searchTerm && orderBy) {
        q = 'trashed=false'
        order = orderBy
    }
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .list({
                corpora: 'allDrives',
                pageSize: 100,
                fields: 'files(' + fileFields + '), nextPageToken',
                includeItemsFromAllDrives: true,
                orderBy: order,
                q,
                supportsAllDrives: true,
            })
            .execute(response => resolve(formatResult(response)))
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
export async function listFilesChunked(searchTerm = '', orderBy = '') {
    let files = []
    let order = ''
    let pageToken = ''
    let q = `fullText contains '${searchTerm}' or name contains '${searchTerm}' and trashed=false`
    if (!searchTerm && orderBy) {
        q = 'trashed=false'
        order = orderBy
    }
    while (typeof pageToken !== 'undefined') {
        const response = await gapi.client.drive.files.list({
            corpora: 'allDrives',
            pageToken: pageToken,
            fields: 'files(' + fileFields + '), nextPageToken',
            includeItemsFromAllDrives: true,
            orderBy: order,
            q,
            supportsAllDrives: true,
        })
        pageToken = response.result.nextPageToken
        files = files.concat(response.result.files)
        //pageToken = undefined
    }
    return files
}

/**
 * Get all revisions of a file.
 *
 * @method listRevisions
 * @return {Promise|Array} A promise of the result that
 * returns an array of revision descriptions.
 */
export function listRevisions(fileId) {
    return gapi.client.drive.revisions.list({
        fileId,
        fields: '*',
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
export async function createFile({
    name,
    parentId,
    supportsAllDrives = true,
    pageName = '',
}) {
    const fileMetadata = {
        name: name,
        mimeType: 'text/json',
        parents: [parentId],
        useContentAsIndexableText: true,
    }
    if (pageName) fileMetadata.properties = { pageName }

    try {
        const response = await window.gapi.client.drive.files.create({
            fields: fileFields,
            resource: fileMetadata,
            supportsAllDrives,
        })
        console.log(response)

        const file = JSON.parse(response.body)
        if (file.teamDriveId && supportsAllDrives) {
            // create permission
            const domain = getDomainOfCurrentUser()
            // eslint-disable-next-line
            const permissionResult = await gapi.client.drive.permissions.create(
                {
                    fields: '*',
                    fileId: file.id,
                    resource: {
                        allowFileDiscovery: true,
                        domain,
                        role: 'fileOrganizer',
                        type: 'domain',
                    },
                    supportsAllDrives,
                }
            )
        }

        return response.result.id
    } catch (err) {
        alert(`Couldn't create new file. Please reload the page and try again.`)
        console.log(err)
    }
}

/**
 * @typedef CreateNewWikiParams
 * @property {string} [name]
 * @property {string|null} [parentId]
 * @property {boolean} [supportsAllDrives]
 * @property {string} [description]
 * @property {boolean} [isWikiRoot]
 */
/**
 * Creates a new (wiki) folder in the base directory
 *
 * @method createNewWiki
 * @param {CreateNewWikiParams} [opts]
 * @return {object} An id of the created file
 * a file description: {driveId, driveVersion, name, ifid}
 */
export async function createNewWiki({
    description = '',
    isWikiRoot = true,
    name = 'Fulcrum Documents',
    parentId = null,
    supportsAllDrives = true,
} = {}) {
    const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
    }
    if (parentId) fileMetadata.parents = [parentId]
    if (description) fileMetadata.description = description
    if (isWikiRoot) fileMetadata.properties = { wikiRoot: true }

    try {
        const result = await gapi.client.drive.files.create({
            fields: fileFields,
            resource: fileMetadata,
            supportsAllDrives,
        })

        const folder = JSON.parse(result.body)
        console.log(folder)
        if (folder.teamDriveId && supportsAllDrives) {
            // create permission
            const domain = getDomainOfCurrentUser()
            // eslint-disable-next-line
            const permissionResult = await gapi.client.drive.permissions.create(
                {
                    fields: '*',
                    fileId: folder.id,
                    resource: {
                        allowFileDiscovery: true,
                        domain,
                        role: 'fileOrganizer',
                        type: 'domain',
                    },
                    supportsAllDrives,
                }
            )
        }
        return folder
    } catch (err) {
        alert(`We couldn't create your base on your Google Drive.`)
        console.error(err.body)
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
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
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
export async function getFolderId(name = 'Fulcrum Documents') {
    try {
        const result = await gapi.client.drive.files.list({
            q: `name="${name}"`,
            pageSize: 100,
            fields: 'nextPageToken, files(id, name, createdTime)',
        })
        const resultBody = JSON.parse(result.body)

        if (resultBody.files.length > 0)
            return _.thread(
                resultBody,
                [_.get, 'files'],
                [_.orderBy, 'createdTime'],
                _.head,
                [_.get, 'id']
            )
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
export function renameFile(driveId, newName, supportsAllDrives = true) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .update({
                fileId: driveId,
                name: newName,
                fields: fileFields,
                supportsAllDrives,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                reject
            )
    })
}

/**
 * Changes the metadata of the file on Google Drive. Can reject
 *
 * @method updateMetadata
 * @param {String} driveId Google Drive file identifier
 * @param {object} metadata New metadata that will be displayed in drive
 * @return {Promise|Object} A promise of the result that returns
 * a file description: {driveId, driveVersion, name, ifid}
 */
export function updateMetadata(driveId, metadata) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .update({
                fileId: driveId,
                ...metadata,
                fields: fileFields,
                supportsAllDrives: true,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                reject
            )
    })
}

/**
 * Changes the metadata of the file on Google Drive. Can reject
 *
 * @method moveFile
 * @param {String} driveId id of the file to move
 * @param {String} sourceId id of the current parent folder
 * @param {object} targetId id of the new parent folder
 * @return {Promise|Object} A promise of the result that returns
 * a file description: {driveId, driveVersion, name, ifid}
 */
export function moveFile(driveId, sourceId, targetId) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files
            .update({
                fileId: driveId,
                removeParents: sourceId,
                addParents: targetId,
                enforceSingleParent: true,
                fields: fileFields,
                supportsAllDrives: true,
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
 * Removes removes from drive. Can reject
 *
 * @method deleteRevision
 * @param {String} fileId Google Drive file identifier
 * @param {String} revisionId The ID of the revision.
 * @return {Promise} A promise of the result
 */
export function deleteRevision(fileId, revisionId) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.revisions
            .delete({
                fileId,
                revisionId,
            })
            .then(resolve, reject)
    })
}

/**
 * Replaces the file content with newData. Can reject
 *
 * @method updateFile
 * @param {String} driveId Google Drive file identifier
 * @param {any} newData Data to put into the file
 * @return {Promise|Object} A promise of the result that returns
 * a story description: {driveId, driveVersion, name, ifid}
 */
export function updateFile(driveId, newData, supportsAllDrives = true) {
    return new Promise((resolve, reject) => {
        gapi.client
            .request({
                path: driveUploadPath + '/' + driveId,
                method: 'PATCH',
                params: {
                    uploadType: 'media',
                    fields: fileFields,
                    useContentAsIndexableText: true,
                    supportsAllDrives,
                },
                body: newData,
            })
            .then(
                response => resolve(formatFileDescription(response.result)),
                reject
            )
    })
}

/**
 * Replaces the file content with newData. Can reject
 *
 * @method refreshSession
 * @return {Promise|Object} A promise of the result that returns
 * a story description: {driveId, driveVersion, name, ifid}
 */
export function refreshSession() {
    const isTokenValid = function () {
        var token = gapi.auth.getToken()
        return token && Date.now() < token.expires_at
    }
    console.log(isTokenValid())
    return reloadAuthResponse()
}

/**
 * Reloads the auth instance
 *
 * @returns {Promise|Object}
 */
export function reloadAuthResponse() {
    return gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
}

// helpers

function formatResult(response) {
    console.log(response)
    var stories = []
    for (var i = 0; i < response.files.length; i++) {
        const file = response.files[i]
        //stories.push(formatFileDescription(file));
        stories.push(file)
    }
    return stories
}

/**
 * Produces the domain of the current user based on his email. If this is not present it doesn't work.
 * @returns email string
 */
function getDomainOfCurrentUser() {
    const email = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getEmail()
    const domain = email.split('@')[1]
    if (domain) {
        return domain
    } else {
        throw new Error('No domain found')
    }
}
