//@ts-nocheck
import { IFile, IFileOrNull } from 'reactn/default'
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
function getParents(file: IFileOrNull, files: Array<IFile>): IFile {
    // The overview of a wiki shouldn't have a parent
    if (!file?.parentId) return []
    const parentFile = getMetaById(file.parentId, files)
    if (!parentFile) return []
    return [parentFile]
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
    return folder
}

export function getChildren(parent: IFile, files: IFile[]) {
    return files.filter(el => el.parentId === parent.id)
}

/**
 * Produces the child folder for a given file if it exists and it has relevant content.
 * The child folder has the same name as the id of the given file, if it exists.
 * @param {string} fileId
 * @param {any[]} files
 * @returns {string | null}
 */
export function getParentFolderId(file, files) {
    if (file.title === '_myDrive_overview_please_do_not_touch.gwiki') {
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
 * @param {string} parentId
 * @param {any[]} files
 * @returns {any[]}
 */
export function filterChildFiles(parentId, files) {
    if (parentId)
        return files.filter(file => {
            try {
                return file.parentId === parentId
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
    return file.parentId === parentId
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
