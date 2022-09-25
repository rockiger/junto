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
    if (files && files.map) {
        const items = files
            .filter(file => {
                const ext = getExtFromFileName(file.title)
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
 * @param {object} initialValue
 * @param {object} localStorageId
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
 * @param {object} initialValue
 *
 * @return a filedescription with the minium of id and modifiedTime
 */
export async function save(fileId, initialValue) {
    console.log('save()')
    const newValue = localStorage.getItem(fileId) || ''
    if (initialValue === newValue) {
        console.log('SAME SAME')
        return new Promise((resolve, reject) =>
            resolve({ modifiedTime: undefined })
        )
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
        if (
            err.status === 401 &&
            err.result?.error?.message === 'Invalid Credentials'
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

const updateModifiedTimeItem = (items, id, change) =>
    items.map(item => {
        if (item.id === id) {
            return { ...item, ...change }
        } else {
            return item
        }
    })
