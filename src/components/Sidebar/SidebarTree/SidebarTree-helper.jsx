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
    const indexes = buildSidebarTreeIndexes(files)
    return indexes.folderIdByPageId.get(fileId) ?? null
}

/**
 * @param {string} fileId
 * @param {Map<string, any>} filesByName
 * @param {Map<string, any[]>} childrenByParentId
 * @returns {string | null}
 */
export function getFolderIdFromIndexes(
    fileId,
    filesByName,
    childrenByParentId,
) {
    const folder = filesByName.get(fileId)
    if (!folder) {
        return null
    }

    const children = childrenByParentId.get(folder.id) ?? []
    for (const child of children) {
        const hasChildThatCounts = isPage(child) && !isArchived(child)
        if (hasChildThatCounts) {
            return folder.id
        }
    }
    return null
}

/**
 * @param {any[]} files
 */
export function buildSidebarTreeIndexes(files) {
    const filesByName = new Map()
    const childrenByParentId = new Map()

    for (const file of files) {
        filesByName.set(file.name, file)
        const parentId = file.parents?.[0]
        if (parentId) {
            const siblings = childrenByParentId.get(parentId)
            if (siblings) {
                siblings.push(file)
            } else {
                childrenByParentId.set(parentId, [file])
            }
        }
    }

    const folderIdByPageId = new Map()
    for (const file of files) {
        const folderId = getFolderIdFromIndexes(
            file.id,
            filesByName,
            childrenByParentId,
        )
        if (folderId) {
            folderIdByPageId.set(file.id, folderId)
        }
    }

    return { filesByName, childrenByParentId, folderIdByPageId }
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
            file.name === OVERVIEW_NAME && file.parents.includes(rootFolderId)
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
    const { mimeType, name, parents, trashed } = file

    return !!(
        mimeType === 'application/json' &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents?.includes(parentId) &&
        trashed === false &&
        !isArchived(file)
    )
}

/** @param {import('reactn/default').IFile[]} files */
export function sortFilesByName(files) {
    return [...files].sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}
