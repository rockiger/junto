import { getGlobal, setGlobal } from 'reactn'
import { IFile, SimpleMap } from 'reactn/default'

import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import {
    createFile as createFileBase,
    createNewWiki as createNewWikiBase,
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
    setGlobal({ backgroundUpdate: true })
    try {
        const initialFiles = await listFilesChunked('')
        setGlobal({
            backgroundUpdate: false,
            initialFiles,
        })
    } catch (err: unknown) {
        const apiErr = err as { body?: string; message?: string }
        const body =
            typeof apiErr.body === 'string'
                ? (JSON.parse(apiErr.body) as {
                      error?: { message?: string }
                  })
                : null
        const error = body?.error
        if (error?.message === 'Invalid Credentials') {
            try {
                await refreshSession()
                backgroundUpdateFiles()
            } catch (refreshErr: unknown) {
                const message =
                    refreshErr instanceof Error
                        ? refreshErr.message
                        : String(refreshErr)
                alert(`Couldn't refresh session: ${message}`)
                console.log({ err: refreshErr })
            }
        } else {
            alert(`Couldn't update files ${String(err)}`)
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
    fileContent: any = EMPTYVALUE,
    pageNameProperty: string = ''
) => {
    try {
        const newFileId = await createFileBase({
            name: fileName,
            parentId: fileParentId,
            pageName: pageNameProperty,
        })
        const result = await updateFileBase(newFileId, fileContent)
        console.log({ result })
        const { initialFiles } = getGlobal()
        setGlobal({
            backgroundUpdate: true,
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
 * @typedef CreateNewWikiParams
 * @property {string} [name]
 * @property {string|null} [parentId]
 * @property {boolean} [supportsAllDrives]
 * @property {string} [description]
 * @property {boolean} [isWikiRoot]
 */
/**
 * Creates a new (wiki) folder in the base directory
 * Updates the global state.
 *
 * @method createNewWiki
 * @param {CreateNewWikiParams} [opts]
 * @return {string} An id of the created file
 * a file description: {driveId, driveVersion, name, ifid}
 */
export const createNewWiki = async (opts: {
    name?: string
    parentId?: string | null
    supportsAllDrives?: boolean
    description?: string
    isWikiRoot?: boolean
}) => {
    try {
        const result = await createNewWikiBase(opts)
        console.log({ newWikiResult: result })
        const { initialFiles } = getGlobal()
        // Unlike create new file we don't need to reset the isCreatingNewFile
        // propery, because there should always be a new file created.
        const file = result as IFile
        setGlobal({
            initialFiles: [...initialFiles, file],
        })
        return file.id
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
