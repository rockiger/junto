//@ts-check
import { EXT, OVERVIEW_NAME } from 'lib/constants'
import { isArchived, isPage } from 'lib/helper'

/**
 * Produces the child folder for a given file if it exists and it has relevant content.
 * The child folder has the same name as the id of the given file, if it exists.
 * @param {string} fileId
 * @param {any[]} files
 * @returns {string | null}
 */
export function getFolderId(fileId, files) {
    const folder = files.find(file => file.title === fileId)

    if (folder) {
        const children = files.filter(file => {
            return file.parents && file.parents.includes(folder.id)
        })

        for (const child of children) {
            const hasChildThatCounts = isPage(child) && !isArchived(child)
            if (hasChildThatCounts) {
                return folder.id
            }
        }
    }
    return null
}

/**
 *
 * @param {any[]} files
 * @param {string} rootFolderId
 * @returns {string}
 */
export function getOverviewFileId(files, rootFolderId) {
    const overview = files.find(
        file =>
            file.title === OVERVIEW_NAME && file.parents.includes(rootFolderId)
    )
    if (overview) return overview.id
    return ''
}

/**
 *
 * @param {string} folderId
 * @param {any[]} files
 * @returns {any[]}
 */
export function filterChildFiles(folderId, files) {
    if (folderId)
        return files.filter(file => {
            try {
                return file.parents && file.parents.includes(folderId)
            } catch (err) {
                console.error(err)
                console.log(file)
                return false
            }
        })
    return []
}

/**
 *
 * @param {import('reactn/default').IFile} file
 * @param {string} parentId
 */
export function shouldFileDisplay(file, parentId) {
    return file.parentId === parentId
}

export function sortFilesByName(files) {
    return files.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}
