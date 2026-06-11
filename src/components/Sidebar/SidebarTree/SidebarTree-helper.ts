import { EXT, MYHOME, OVERVIEW_NAME } from 'lib/constants'
import { getTitleFromFile, isArchived, isPage } from 'lib/helper'
import type { IFile } from 'reactn/default'
import type { WikiTreeNode } from './SidebarTree-types'

export type SidebarTreeIndexes = {
    filesByName: Map<string, IFile>
    childrenByParentId: Map<string, IFile[]>
    folderIdByPageId: Map<string, string>
}

/**
 * Produces the child folder for a given file if it exists and it has relevant content.
 * The child folder has the same name as the id of the given file, if it exists.
 */
export function getFolderId(
    fileId: string,
    files: IFile[],
): string | null {
    const indexes = buildSidebarTreeIndexes(files)
    return indexes.folderIdByPageId.get(fileId) ?? null
}

export function getFolderIdFromIndexes(
    fileId: string,
    filesByName: Map<string, IFile>,
    childrenByParentId: Map<string, IFile[]>,
): string | null {
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

export function buildSidebarTreeIndexes(files: IFile[]): SidebarTreeIndexes {
    const filesByName = new Map<string, IFile>()
    const childrenByParentId = new Map<string, IFile[]>()

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

    const folderIdByPageId = new Map<string, string>()
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

export function getOverviewFileId(
    files: IFile[],
    rootFolderId: string | null,
): string {
    if (!rootFolderId) return ''
    const overview = files.find(
        file =>
            file.name === OVERVIEW_NAME && file.parents.includes(rootFolderId),
    )
    if (overview) return overview.id
    return ''
}

export function filterChildFiles(
    folderId: string,
    files: IFile[],
): IFile[] {
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

export function shouldFileDisplay(
    file: IFile,
    parentId: string | null,
): boolean {
    const { name, parents, trashed } = file

    return !!(
        parentId &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents?.includes(parentId) &&
        trashed === false &&
        !isArchived(file)
    )
}

export function sortFilesByName(files: IFile[]): IFile[] {
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

/** Whether `pageId` lives anywhere under a wiki root folder (My Wiki or a shared-drive wiki). */
export function isPageUnderWikiRoot(
    pageId: string,
    wikiRootFolderId: string | null,
    files: IFile[],
): boolean {
    if (!pageId || !wikiRootFolderId) {
        return false
    }

    const filesById = new Map(files.map(file => [file.id, file]))
    let folderId = filesById.get(pageId)?.parents?.[0]

    while (folderId) {
        if (folderId === wikiRootFolderId) {
            return true
        }
        const folder = filesById.get(folderId)
        if (!folder) {
            return false
        }
        folderId = folder.parents?.[0]
    }

    return false
}

/**
 * Returns page IDs whose tree nodes must be expanded so `pageId` is visible
 * in the sidebar (ancestors plus the wiki root overview entry).
 */
export function getExpandedAncestorPageIds(
    pageId: string,
    files: IFile[],
    rootFolderId: string | null,
): Set<string> {
    const expanded = new Set<string>()
    if (
        !pageId ||
        !rootFolderId ||
        !isPageUnderWikiRoot(pageId, rootFolderId, files)
    ) {
        return expanded
    }

    const filesById = new Map(files.map(file => [file.id, file]))
    const overviewId = getOverviewFileId(files, rootFolderId)

    if (pageId !== overviewId && overviewId) {
        expanded.add(overviewId)
    }

    const currentFile = filesById.get(pageId)
    if (!currentFile) {
        return expanded
    }

    let folderId = currentFile.parents?.[0]
    while (folderId && folderId !== rootFolderId) {
        const folder = filesById.get(folderId)
        if (!folder) {
            break
        }

        const parentPageId = folder.name
        if (filesById.has(parentPageId)) {
            expanded.add(parentPageId)
        }

        folderId = folder.parents?.[0]
    }

    return expanded
}

export function buildWikiTreeNode(
    pageId: string,
    parentFolderId: string | null,
    label: string,
    files: IFile[],
    indexes: SidebarTreeIndexes,
): WikiTreeNode {
    const seenChildIds = new Set<string>()
    const childFiles = sortFilesByName(
        files.filter(file => {
            if (!shouldFileDisplay(file, parentFolderId)) {
                return false
            }
            if (seenChildIds.has(file.id)) {
                return false
            }
            seenChildIds.add(file.id)
            return true
        }),
    )

    const children = childFiles.map(file => {
        const folderId = indexes.folderIdByPageId.get(file.id) ?? null
        return buildWikiTreeNode(
            file.id,
            folderId,
            getTitleFromFile(file),
            files,
            indexes,
        )
    })

    return {
        id: pageId,
        label,
        parentFolderId,
        children,
    }
}

export function buildMyHomeTreeRoot(
    files: IFile[],
    rootFolderId: string | null,
    indexes?: SidebarTreeIndexes,
): WikiTreeNode | null {
    if (!rootFolderId) {
        return null
    }

    const overviewId = getOverviewFileId(files, rootFolderId)
    if (!overviewId) {
        return null
    }

    const treeIndexes = indexes ?? buildSidebarTreeIndexes(files)
    return buildWikiTreeNode(
        overviewId,
        rootFolderId,
        MYHOME,
        files,
        treeIndexes,
    )
}

export function buildSharedDriveTreeRoots(
    files: IFile[],
    sharedDriveWikiItems: IFile[],
    indexes?: SidebarTreeIndexes,
): WikiTreeNode[] {
    const treeIndexes = indexes ?? buildSidebarTreeIndexes(files)

    return sharedDriveWikiItems.map(file =>
        buildWikiTreeNode(
            file.id,
            file.parents[0] ?? null,
            getTitleFromFile(file),
            files,
            treeIndexes,
        ),
    )
}
