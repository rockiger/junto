import { getGlobal, setGlobal } from 'reactn'
import { SimpleMap } from 'reactn/default'

import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import {
    createFile as createFileBase,
    listFilesChunked,
    refreshSession,
    updateFile as updateFileBase,
    updateMetadata as updateMetadataBase,
} from 'lib/gdrive'
import { filesUpdater } from 'lib/helper'

/**
 * Silently update the the files metadata for the current state.
 * @return {Promise|void}
 */
export const backgroundUpdateFiles = async () => {
    const { searchTerm } = getGlobal()
    setGlobal({ backgroundUpdate: true })
    try {
        const files = await listFilesChunked(searchTerm)
        setGlobal({
            backgroundUpdate: false,
            files,
            initialFiles: files,
            isFileListLoading: false,
            oldSearchTerm: searchTerm,
        })
    } catch (err) {
        const body = JSON.parse(err.body)
        const { error } = body
        if (error.message === 'Invalid Credentials') {
            try {
                await refreshSession()
                backgroundUpdateFiles()
            } catch (err) {
                alert(`Couldn't refresh session: ${err.message}`)
                console.log({ err })
            }
        } else {
            alert(`Couldn't update files ${err}`)
            console.log({ error })
        }
    }
}

/**
 * Creates a new file with the given file name and the givent parent,
 * with the given content.
 * Updates the global state.
 * @param fileName
 * @param fileParentId
 * @param fileContent a stringifyd JSON object object
 * @return {Promise<string|void>
 */
export const createFile = async (
    fileName: string = UNTITLEDFILE,
    fileParentId: string = '',
    fileContent: any = EMPTYVALUE
) => {
    try {
        const newFileId = await createFileBase(fileName, fileParentId)
        const result = await updateFileBase(newFileId, fileContent)
        console.log({ result })
        const { files, initialFiles } = getGlobal()
        setGlobal({
            backgroundUpdate: true,
            files: [...files, result],
            initialFiles: [...initialFiles, result],
            isCreatingNewFile: false,
        })
        return newFileId
    } catch (err) {
        setGlobal({ isCreatingNewFile: false })
        console.log(err)
    }
}

/**
 * Changes the metadata of the given file in the global state in files
 * and initialFiles and on Google Drive. Updates the global state
 * optimistically and after the promise is finished.
 *
 * @method updateMetadata
 * @param {String} driveId Google Drive file identifier
 * @param {object} metadata New metadata of that filethat will be displayed in drive
 * @return {Promise|void}
 */
export const updateMetadata = async (
    fileId: string,
    metadata: SimpleMap,
    doBackgroundUpdate = false
) => {
    const updatedFiles = filesUpdater(metadata, getGlobal(), fileId)
    setGlobal({
        files: updatedFiles.files,
        initialFiles: updatedFiles.initialFiles,
    })
    await updateMetadataBase(fileId, metadata)
    if (doBackgroundUpdate) await backgroundUpdateFiles()
}
