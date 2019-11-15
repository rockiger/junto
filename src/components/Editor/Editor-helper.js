//@ts-check

import FulcrumLogo from 'components/FulcrumLogo'
import { updateFile } from 'lib/gdrive'
import { getExtFromFileName, getTitleFromFileName } from 'lib/helper'

import { EXT } from 'lib/constants'

/**
 *
 * @param {any[]} files
 * @return {any[]}
 */
export function convertFilesToAutocompletItems(files) {
    if (files && files.map) {
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
                    name: getTitleFromFileName(file.name),
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
 * @param {string} fileId
 * @param {object} initialValue
 */
export async function save(fileId, initialValue) {
    console.log('save()')
    const newValue = localStorage.getItem(fileId) || ''
    if (initialValue === newValue) {
        console.log('SAME SAME')
        return
    }

    // Extract text from document
    /* const document = Document.create(JSON.parse(newValue).document)
    const text = document
        .getTexts()
        .reduce((acc, currVal, currIndex, array) => {
            return `${acc} ${currVal.getText()}`
        }, '')
    console.log(text) */

    try {
        await updateFile(fileId, newValue)
        console.log('save:', fileId)
    } catch (err) {
        alert(
            `Couldn't save file with id: ${fileId}.\nPlease copy the content and reload the page.`
        )
        console.log("save: Couldn't save file with id:", fileId)
        console.log('Error:', err)
    }
}
