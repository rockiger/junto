import { IMeta, IMetaOrNull } from './Breadcrumbs.d'
import { FOLDER_NAME, OVERVIEW_NAME } from 'lib/constants'

/**
 * Retrieve the meta information of a given file
 * @param fileId the id of the file
 * @param files the list of files where the the meta information are retrieved from
 * @returns the meta information ot the file
 */
export function getMetaById(fileId: String, files: Array<IMeta>): IMetaOrNull {
    const meta = files.find((el: IMeta) => el.id === fileId)
    if (meta) return meta
    return null
}

/**
 * Constructs an array of parent files of a given file. A parent file is the file
 * where the id of the file is equal to the name of the parent folder of the
 * given file.
 * @param file the file to get parents from
 * @param files the list of files where the parents are retrieved from
 * @returns the list of parents ordered with the farthest parent first
 */
export function getParents(
    file: IMetaOrNull,
    files: Array<IMeta>
): Array<IMeta> {
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
export function getBreadcrumbName(folder: IMetaOrNull, files: Array<IMeta>) {
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

function findWikiFile(files: IMeta[], folder: IMeta) {
    return files.find(el => el.id === folder.name)
}

function findWikiRootFile(files: IMeta[], folder: IMeta) {
    const result = files.find(
        el =>
            el.name === OVERVIEW_NAME &&
            el.parents.includes(folder.id) &&
            el.properties &&
            el.properties.pageName === folder.name
    )
    return result
}

function findPersonalWikiRootFile(files: IMeta[], folder: IMeta) {
    const result = files.find(
        el => el.name === OVERVIEW_NAME && el.parents.includes(folder.id)
    )
    return result
}

function isWikiRoot(folder: IMeta) {
    return folder.properties && folder.properties.wikiRoot
}

function isPersonalRoot(folder: IMeta) {
    return folder.name === FOLDER_NAME
}
