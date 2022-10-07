import { getGlobal, setGlobal } from 'reactn'
import { SimpleMap } from 'reactn/default'

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
import {
    fetchPages,
    fetchSpaces,
    GET_FULCRUM_PAGE,
    normalizeFetchPageData,
    postPage,
    UPDATE_FULCRUM_PAGE,
} from 'lib/wordpress'
import { useCallback, useMemo } from 'react'
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from '@apollo/client'

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
        //@ts-ignore
        const body = JSON.parse(err.body as string)
        const { error } = body
        if (error.message === 'Invalid Credentials') {
            try {
                await refreshSession()
                backgroundUpdateFiles()
            } catch (err) {
                //@ts-ignore
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
    fileContent: any = EMPTYVALUE,
    pageNameProperty: string = ''
) => {
    try {
        //@ts-ignore
        const newFileId = await createFileBase({
            name: fileName,
            parentId: fileParentId,
            pageName: pageNameProperty,
        })
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
export const createNewWiki = async opts => {
    try {
        const result = await createNewWikiBase(opts)
        console.log({ newWikiResult: result })
        const { files, initialFiles } = getGlobal()
        // Unlike create new file we don't need to reset the isCreatingNewFile
        // propery, because there should always be a new file created.
        setGlobal({
            files: [...files, result],
            initialFiles: [...initialFiles, result],
        })
        return result.id
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

//@ts-ignore
export const createPage = async vars => {
    setGlobal({ isCreatingNewFile: true })
    const { files, initialFiles, wikis } = getGlobal()
    const spaceId = _.get(_.first(wikis), 'id')

    //@ts-ignore
    const result = await postPage({ ...vars, spaceId })
    console.log(result)
    const page = normalizeFetchPageData({ fulcrumPage: result })

    setGlobal({
        backgroundUpdate: true,
        files: _.sortBy([...files, page], ['title']),
        initialFiles: _.sortBy([...initialFiles, page], ['title']),
        isCreatingNewFile: false,
    })
    return page
}

export const getWikis = async () => {
    setGlobal({ areWikisLoading: true })
    const wikis = await fetchSpaces()
    setGlobal({ areWikisLoading: true, wikis })
}

export const getFiles = async () => {
    setGlobal({ isFileListLoading: true })
    const files = await fetchPages()
    setGlobal({ files, initialFiles: files, isFileListLoading: false })
}

export const useGetPage = (options: QueryHookOptions = {}) => {
    const __options = options?.onCompleted
        ? {
              ...options,
              onCompleted: data =>
                  //@ts-ignore
                  options.onCompleted(normalizeFetchPageData(data)),
          }
        : options
    const { data, error, loading: isLoading } = useQuery(
        GET_FULCRUM_PAGE,
        __options
    )
    const page = useMemo(
        () => (data ? normalizeFetchPageData(data) : undefined),
        [data]
    )

    return { error, isLoading, page } as const
}

export const useUpdatePage = (options: MutationHookOptions = {}) => {
    const [mutate, ...rest] = useMutation(UPDATE_FULCRUM_PAGE, options)

    const updateFile = useCallback(
        options => {
            const updatedFiles = filesUpdater(
                options.variables,
                getGlobal(),
                //@ts-ignore
                options?.variables?.id
            )
            setGlobal({
                files: updatedFiles.files,
                initialFiles: updatedFiles.initialFiles,
            })
            return mutate(options)
        },
        [mutate]
    )
    return [updateFile, ...rest] as const
}
