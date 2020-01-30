import { IFile, State } from 'reactn/default'

/**
 * Interp. as a Global State with response of Google Drive as
 * properties 'files' and 'intialFiles' added to it.
 */
type IGlobalState = State

/**
 * Helper function for filesUpdater
 *
 * @param change - the change of the file to update
 * @param files - an array of files, probably files or initialFiles from the global state
 * @param id - the file to update
 */
export const filesUpdater = (
    change: IChange,
    global: IGlobalState,
    id: string
) => {
    const files = filesUpdaterHelper(change, global.files, id)
    const initialFiles = filesUpdaterHelper(change, global.initialFiles, id)
    return {
        files,
        initialFiles,
    }
}

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
export const filesUpdaterHelper = (
    change: IChange,
    files: IFile[],
    id: string
) => {
    return files.map(item => {
        if (item.id === id) {
            return { ...item, ...change }
        } else {
            return item
        }
    })
}
