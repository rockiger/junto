import { IFile, IFileOrNull } from 'reactn/default'
import { FOLDER_NAME, OVERVIEW_NAME } from 'lib/constants'
import { getMetaById } from 'lib/helper'

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

function isWikiRoot(folder: IFile) {
    return folder.properties && folder.properties.wikiRoot
}

function isPersonalRoot(folder: IFile) {
    return folder.name === FOLDER_NAME
}
