/* global reactPress */
import { IFile, State } from 'reactn/default'
import { OVERVIEW_NAME } from 'lib/constants'
import { addHours } from 'date-fns'

export {
    filesUpdater,
    filesUpdaterHelper,
    filterIsNotArchived,
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
export type IChange = {
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
            const now = addHours(
                new Date(),
                //@ts-ignore offset the server time because wordpress doesn't has modifiedGmt on drafts
                window.reactPress.gmt_offset
            )
                .toISOString()
                // To have the same format as WordPress and make dates comparable
                .slice(0, -5)
            return {
                ...item,
                ...change,
                modified: now,
            }
        } else {
            return item
        }
    })
}

function filterIsNotArchived(files) {
    const filtered = files.filter(file => {
        return !isArchived(file)
    })
    return filtered
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
    return false
}

function hasProperty(file: IFile, property: string, question: any = 'true') {
    return false
}

function isArchived(file: IFile) {
    const result = hasProperty(file, 'isArchived')
    return result
}

function isWikiRootFile(file: IFile) {
    return file.title === OVERVIEW_NAME
}
function isWikiRootFolder(folder: IFile) {
    return hasProperty(folder, 'wikiRoot')
}
