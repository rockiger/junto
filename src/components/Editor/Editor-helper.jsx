//@ts-check

import FulcrumLogo from 'components/FulcrumLogo'
import { reloadAuthResponse, updateFile } from 'lib/gdrive'
import { getExtFromFileName, getTitleFromFile } from 'lib/helper'

import { EXT } from 'lib/constants'
import { putPage } from 'lib/localDB'

/**
 *
 * @param {any[]} files
 * @return {any[]}
 */
export function convertFilesToAutocompletItems(files) {
    if (Array.isArray(files)) {
        const items = files
            .filter(file => {
                const ext = getExtFromFileName(file.name)
                return ext === EXT
            })
            .map(file => {
                return {
                    href: `/page/${file.id}`,
                    id: file.id,
                    icon: FulcrumLogo,
                    name: getTitleFromFile(file),
                }
            })
        return items
    }
    return []
}

/**
 *
 * @param {string} initialValue
 * @param {string} localStorageId
 * @returns {void}
 */
export function initStorage(initialValue, localStorageId) {
    localStorage.setItem(localStorageId, initialValue)
}

/**
 *
 * Saves the content of the file if neccessary
 *
 * @param {string} fileId
 * @param {string} initialValue
 *
 * @return a filedescription with the minium of id and modifiedTime
 */
export async function save(fileId, initialValue) {
    console.log('save()')
    const newValue = localStorage.getItem(fileId) || ''
    if (initialValue === newValue) {
        console.log('SAME SAME')
        return Promise.resolve({ modifiedTime: undefined })
    }

    try {
        const fileDescription = await updateFile(fileId, newValue)
        await putPage({
            id: fileId,
            content: newValue,
            editedTime: String(fileDescription.modifiedTime),
            modifiedTime: String(fileDescription.modifiedTime),
        })
        console.log('save:', fileId)
        return fileDescription
    } catch (err) {
        const apiErr =
            err && typeof err === 'object'
                ? /** @type {{ status?: number, result?: { error?: { message?: string } } }} */ (
                      err
                  )
                : null
        if (
            apiErr?.status === 401 &&
            apiErr.result?.error?.message === 'Invalid Credentials'
        ) {
            try {
                await reloadAuthResponse()
                const fileDescription = await updateFile(fileId, newValue)
                await putPage({
                    id: fileId,
                    content: newValue,
                    editedTime: String(fileDescription.modifiedTime),
                    modifiedTime: String(fileDescription.modifiedTime),
                })
                console.log('save after reload auth instance:', fileId)
                return fileDescription
            } catch (err) {
                const date = new Date().toISOString()
                await putPage({
                    id: fileId,
                    content: newValue,
                    editedTime: date,
                    modifiedTime: date,
                })
                alert(
                    `Couldn't save file with id: ${fileId}. to Google Drive.\nWe created a local copy.\nPlease copy the content to be save and reload the page.`
                )
                console.log("save: Couldn't save file with id:", fileId)
                console.log('Error:', err)
                return { id: fileId, modifiedTime: date }
            }
        }
        const date = new Date().toISOString()
        await putPage({
            id: fileId,
            content: newValue,
            editedTime: date,
            modifiedTime: date,
        })
        alert(
            `Couldn't save file with id: ${fileId}. to Google Drive.\nWe created a local copy.\nPlease copy the content to be save and reload the page.`
        )
        console.log("save: Couldn't save file with id:", fileId)
        console.log('Error:', err)
        return { id: fileId, modifiedTime: date }
    }
}

/** @param {import('reactn/default').IFile[]} items @param {string} id @param {Record<string, unknown>} change */
const updateModifiedTimeItem = (items, id, change) =>
    items.map(item => {
        if (item.id === id) {
            return { ...item, ...change }
        } else {
            return item
        }
    })

/**
 * @param {string} id
 * @param {string} modifiedByMeTime
 * @param {import('reactn/default').IFile[]} files
 * @param {function} setFiles
 * @param {import('reactn/default').IFile[]} initialFiles
 * @param {function} setInitialFiles
 */
export const updateModifiedTimeInGlobalState = (
    id,
    modifiedByMeTime,
    files,
    setFiles,
    initialFiles,
    setInitialFiles
) => {
    const change = {
        modifiedByMeTime,
    }
    console.log(modifiedByMeTime)
    const newFiles = updateModifiedTimeItem(files, id, change)
    const newInitialFiles = updateModifiedTimeItem(initialFiles, id, change)
    setFiles(newFiles)
    setInitialFiles(newInitialFiles)
}
