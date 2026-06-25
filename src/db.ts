import { queryClient } from 'lib/query/query-client'
import { appendToTree, patchFileCaches, setFileTree } from 'lib/query/files-cache'
import type { IFile, SimpleMap } from 'types/app-state'
import { setAppState } from 'store/app-store'

import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import {
    createFile as createFileBase,
    createNewWiki as createNewWikiBase,
    listFilesChunked,
    updateFile as updateFileBase,
    updateMetadata as updateMetadataBase,
} from 'lib/gdrive'

/**
 * Silently update the the files metadata for the current state.
 * @return {Promise|void}
 */
export const backgroundUpdateFiles = async () => {
    setAppState({ backgroundUpdate: true })
    try {
        const files = await listFilesChunked('')
        setFileTree(queryClient, files)
        setAppState({ backgroundUpdate: false })
    } catch (err: unknown) {
        setAppState({ backgroundUpdate: false })
        const message = err instanceof Error ? err.message : String(err)
        alert(`Couldn't update files: ${message}`)
        console.log({ err })
    }
}

/**
 * Creates a new file with the given file name and the givent parent,
 * with the given content.
 * Updates the query cache.
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
        appendToTree(queryClient, result as IFile)
        setAppState({
            backgroundUpdate: true,
            isCreatingNewFile: false,
        })
        return newFileId
    } catch (err) {
        setAppState({ isCreatingNewFile: false })
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
 * Updates the query cache.
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
        const file = result as IFile
        appendToTree(queryClient, file)
        return file.id
    } catch (err) {
        setAppState({ isCreatingNewFile: false })
        console.log(err)
    }
}

/**
 * Changes the metadata of the given file in the query cache and on Google Drive.
 * Updates the cache optimistically and after the promise is finished.
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
    patchFileCaches(queryClient, metadata, fileId)
    await updateMetadataBase(fileId, metadata)
    if (doBackgroundUpdate) await backgroundUpdateFiles()
}
