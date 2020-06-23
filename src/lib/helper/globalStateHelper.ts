import { IFile, State } from 'reactn/default'
import { OVERVIEW_NAME } from 'lib/constants'

export {
    filesUpdater,
    filesUpdaterHelper,
    getMetaById,
    hasChildren,
    isArchived,
    isWikiRootFile,
    isWikiRootFolder,
}

/**
 * Interp. as a Global State with response of Google Drive as
 * properties 'files' and 'intialFiles' added to it.
 */
type IGlobalState = State

/**
 * Interp. as the change to a files meta data.
 * Change should consist of properties from IFile.
 */
type IChange = {
    id?: string
    mimeType?: 'application/vnd.google-apps.folder' | 'application/json'
    name?: string
    ownedByMe?: boolean
    parents?: Array<string> // the id of the parrent of a file
    properties?: { [key: string]: any }
    shared?: boolean
}

/**
 * Helper function for filesUpdater
 *
 * @param change - the change of the file to update
 * @param files - an array of files, probably files or initialFiles from the global state
 * @param id - the file to update
 */
const filesUpdater = (change: IChange, global: IGlobalState, id: string) => {
    const files = filesUpdaterHelper(change, global.files, id)
    const initialFiles = filesUpdaterHelper(change, global.initialFiles, id)
    return {
        files,
        initialFiles,
    }
}

/**
 * Helper function for filesUpdater
 *
 * @param change - the change of the file to update
 * @param files - an array of files, probably files or initialFiles from the global state
 * @param id - the file to update
 */
const filesUpdaterHelper = (change: IChange, files: IFile[], id: string) => {
    return files.map(item => {
        if (item.id === id) {
            const now = new Date().toISOString()
            return {
                ...item,
                ...change,
                modifiedByMeTime: now,
                modifiedTime: now,
            }
        } else {
            return item
        }
    })
}

/**
 * Retrieve the meta information of a given file
 * @param fileId the id of the file
 * @param files the list of files where the the meta information are retrieved from
 * @returns the meta information ot the file
 */
function getMetaById(fileId: String, files: Array<IFile>): IFile | null {
    const meta = files.find((el: IFile) => el.id === fileId)
    if (meta) return meta
    return null
}

/**
 * Checks if a page has children
 * @param fileId - the id of the page
 * @param files - the files to check
 */
function hasChildren(fileId: string, files: IFile[]) {
    const folder = files.find(file => file.name === fileId)
    if (folder) {
        return Boolean(
            files.filter(
                file => file.parents && file.parents.includes(folder.id)
            ).length
        )
    }
    return false
}

function hasProperty(file: IFile, property: string, question: any = 'true') {
    return Boolean(
        file.properties &&
            file.properties[property] &&
            file.properties[property] === question
    )
}

function isArchived(file: IFile) {
    const result = hasProperty(file, 'isArchived')
    return result
}

function isWikiRootFile(file: IFile) {
    return file.name === OVERVIEW_NAME
}
function isWikiRootFolder(folder: IFile) {
    return hasProperty(folder, 'wikiRoot')
}
