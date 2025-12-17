import { OVERVIEW_NAME } from 'lib/constants'

export function isPage(location) {
    if (location.pathname.startsWith('/page/')) return true
    return false
}

export function getPageId(location) {
    const path = location.pathname
    return path.slice('/page/'.length)
}

export function getParentFolderId(pageId, files) {
    const file = files.find((f) => f.id === pageId)
    return file.parents[0]
}

/**
 * Get the fileId for a given name. Return empty string if there is no parent.
 * @param {string} name
 * @param {import('reactn/default').IFile[]} files
 */
export function getIdByName(name, files) {
    const file = files.find((f) => f.name === name)
    return file ? file.id : ''
}

/**
 *
 * @param {string} id
 * @param {import('reactn/default').IFile[]} files
 */
export function getParentIfOverview(id, files) {
    const overviewFile = files.find((f) => f.id === id)
    if (overviewFile && overviewFile.name === OVERVIEW_NAME) {
        return overviewFile.parents[0]
    }
    return ''
}

/**
 * Get the parentfolder of new page depending on it's parent page. If the parent page is an
 * overview page, its parent given.
 * @param {string} parentPageId
 * @param {import('reactn/default').IFile[]} files
 * @returns {string} the parentfolder's id or ''
 */
export function getParentFolderIdOfNewFile(parentPageId, files) {
    const parentIfOverview = getParentIfOverview(parentPageId, files)
    if (parentIfOverview) {
        return parentIfOverview
    } else {
        return getIdByName(parentPageId, files)
    }
}
