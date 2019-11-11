//@ts-check
import { EXT, OVERVIEW_NAME } from '../../../lib/constants'

/**
 *
 * @param {string} fileId
 * @param {any[]} files
 * @returns {string | null}
 */
export function getFolderId(fileId, files) {
    const folder = files.find(file => file.name === fileId)
    return folder ? folder.id : null
}

/**
 *
 * @param {any[]} files
 * @returns {string}
 */
export function getOverviewFileId(files) {
    const overview = files.find(file => file.name === OVERVIEW_NAME)
    if (overview) return overview.id
    return ''
}

/**
 *
 * @param {string} folderId
 * @param {any[]} files
 * @returns {any[]}
 */
export function filterChildFiles(folderId, files) {
    if (folderId)
        return files.filter(file => {
            try {
                return file.parents && file.parents.includes(folderId)
            } catch (err) {
                console.error(err)
                console.log(file)
                return false
            }
        })
    return []
}

/**
 *
 * @param {object} file
 * @param {string} parentId
 */
export function shouldFileDisplay(file, parentId) {
    const { mimeType, name, ownedByMe, parents, trashed } = file
    if (!ownedByMe) return false
    return (
        mimeType === 'application/json' &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents.includes(parentId) &&
        trashed === false
    )
}

export function sortFilesByName(files) {
    return files.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}
