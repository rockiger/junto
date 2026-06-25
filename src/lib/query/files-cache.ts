import type { QueryClient } from '@tanstack/react-query'
import type { IFile } from 'types/app-state'

import { queryKeys } from './query-keys'

type FileChange = {
    id?: string
    mimeType?: IFile['mimeType']
    name?: string
    ownedByMe?: boolean
    parents?: Array<string>
    properties?: { [key: string]: unknown }
    shared?: boolean
    viewedByMe?: boolean
    viewedByMeTime?: string
}

function patchFileInList(
    change: FileChange,
    files: IFile[],
    id: string,
): IFile[] {
    return files.map((item) => {
        if (item.id !== id) {
            return item
        }
        const now = new Date().toISOString()
        return {
            ...item,
            ...change,
            modifiedByMeTime: now,
            modifiedTime: now,
        }
    })
}

export function getFileTree(queryClient: QueryClient): IFile[] {
    return queryClient.getQueryData<IFile[]>(queryKeys.filesTree) ?? []
}

export function setFileTree(queryClient: QueryClient, files: IFile[]): void {
    queryClient.setQueryData(queryKeys.filesTree, files)
}

export function appendToTree(queryClient: QueryClient, file: IFile): void {
    const tree = getFileTree(queryClient)
    queryClient.setQueryData(queryKeys.filesTree, [...tree, file])
}

export function upsertFilesInTree(
    queryClient: QueryClient,
    newFiles: IFile[],
): void {
    const tree = getFileTree(queryClient)
    let next = [...tree]
    for (const file of newFiles) {
        const idx = next.findIndex((item) => item.id === file.id)
        if (idx >= 0) {
            next[idx] = file
        } else {
            next = [...next, file]
        }
    }
    setFileTree(queryClient, next)
}

export function patchFileInTree(
    queryClient: QueryClient,
    change: FileChange,
    id: string,
): void {
    const tree = getFileTree(queryClient)
    queryClient.setQueryData(
        queryKeys.filesTree,
        patchFileInList(change, tree, id),
    )
}

export function patchFileInSearchCaches(
    queryClient: QueryClient,
    change: FileChange,
    id: string,
): void {
    const queries = queryClient.getQueriesData<IFile[]>({
        queryKey: ['files', 'search'],
    })

    for (const [key, data] of queries) {
        if (!data?.some((item) => item.id === id)) {
            continue
        }
        queryClient.setQueryData(key, patchFileInList(change, data, id))
    }
}

export function patchFileCaches(
    queryClient: QueryClient,
    change: FileChange,
    id: string,
): void {
    patchFileInTree(queryClient, change, id)
    patchFileInSearchCaches(queryClient, change, id)
}
