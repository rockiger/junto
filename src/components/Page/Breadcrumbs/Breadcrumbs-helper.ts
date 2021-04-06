import { IFile, IFileOrNull } from 'reactn/default'
import { EXT, FOLDER_NAME, OVERVIEW_NAME } from 'lib/constants'
import { getMetaById, isArchived, isWikiRootFolder as isWikiRoot } from 'lib/helper'

export { getMetaById, getParents, getBreadcrumbName }
/**
 * Constructs an array of parent files of a given file. A parent file is the file
 * where the id of the file is equal to the name of the parent folder of the
 * given file.
 * @param file the file to get parents from
 * @param files the list of files where the parents are retrieved from
 * @returns the list of parents ordered with the farthest parent first
 */
function getParents(file: IFileOrNull, files: Array<IFile>): Array<IFile> {
    // The overview of a wiki shouldn't have a parent
    if (!file || file.name === OVERVIEW_NAME || !file.parents) return []
    const parentFolder = getMetaById(file.parents[0], files)
    const parentFile = getBreadcrumbName(parentFolder, files)
    if (!parentFolder || !parentFile) return []
    return [...getParents(parentFolder, files), parentFile]
}

/**
 * Retrives the index file of a given folder. An index file is the file
 * where the id of the file is equal to the name of the folder of the
 * given folder.
 * @param folder the folder to get the index file from
 * @param files the list of files where the index file is retrieved from
 * @returns the file to which the name of the file should be derived from
 */
function getBreadcrumbName(folder: IFileOrNull, files: Array<IFile>) {
    if (!folder) return null
    if (isPersonalRoot(folder)) {
        return findPersonalWikiRootFile(files, folder)
    }
    if (isWikiRoot(folder)) {
        return findWikiRootFile(files, folder)
    }
    const result = findWikiFile(files, folder)
    // if the folder doesn't have a corresponding file, it must be
    // a root folder
    return result ? result : folder
}

function findWikiFile(files: IFile[], folder: IFile) {
    return files.find((el) => el.id === folder.name)
}

function findWikiRootFile(files: IFile[], folder: IFile) {
    const result = files.find(
        (el) =>
            el.name === OVERVIEW_NAME &&
            el.parents.includes(folder.id) &&
            el.properties &&
            el.properties.pageName === folder.name
    )
    return result
}

function findPersonalWikiRootFile(files: IFile[], folder: IFile) {
    const result = files.find(
        (el) => el.name === OVERVIEW_NAME && el.parents.includes(folder.id)
    )
    return result
}

function isPersonalRoot(folder: IFile) {
    return folder.name === FOLDER_NAME
}

export function getChildren(parent: IFile, files: IFile[]) {
    const folderId = getParentFolderId(parent, files)
    return filterChildFiles(folderId,files).filter(el => shouldFileDisplay(el, folderId))
}

/**
 * Produces the child folder for a given file if it exists and it has relevant content.
 * The child folder has the same name as the id of the given file, if it exists.
 * @param {string} fileId
 * @param {any[]} files
 * @returns {string | null}
 */
export function getParentFolderId(file, files) {
    if (file.name === "_myDrive_overview_please_do_not_touch.gwiki") {
        return file.parents[0] ?? ''
    } else {
        const folder = files.find(el => el.name === file.id)
    if (folder) {
        return folder.id
    }
}
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
    const { mimeType, name, parents, trashed } = file
    return (
        mimeType === 'application/json' &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents &&
        parents.includes(parentId) &&
        trashed === false &&
        !isArchived(file)
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
