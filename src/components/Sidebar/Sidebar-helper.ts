import { OVERVIEW_NAME } from 'lib/constants'
import type { IFile } from 'reactn/default'
import type { ParsedLocation } from '@tanstack/react-router'

export function isPage(location: ParsedLocation): boolean {
    if (location.pathname.startsWith('/page/')) return true
    return false
}

export function getPageId(location: ParsedLocation): string {
    const path = location.pathname
    return decodeURIComponent(path.slice('/page/'.length).replace(/\/$/, ''))
}

export function getParentFolderId(pageId: string, files: IFile[]): string {
    const file = files.find(f => f.id === pageId)!
    return file.parents[0]
}

export function getIdByName(name: string, files: IFile[]): string {
    const file = files.find(f => f.name === name)
    return file ? file.id : ''
}

export function getParentIfOverview(id: string, files: IFile[]): string {
    const overviewFile = files.find(f => f.id === id)
    if (overviewFile && overviewFile.name === OVERVIEW_NAME) {
        return overviewFile.parents[0]
    }
    return ''
}

export function getParentFolderIdOfNewFile(
    parentPageId: string,
    files: IFile[],
): string {
    const parentIfOverview = getParentIfOverview(parentPageId, files)
    if (parentIfOverview) {
        return parentIfOverview
    }
    return getIdByName(parentPageId, files)
}
