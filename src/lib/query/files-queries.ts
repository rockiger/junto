import { useQuery } from '@tanstack/react-query'
import { listFilesChunked } from 'lib/gdrive'
import { useGoogleAuth } from 'lib/googleAuth'
import { queryClient } from 'lib/query/query-client'
import type { IFile } from 'types/app-state'

import { queryKeys } from './query-keys'

const TREE_STALE_TIME = 5 * 60 * 1000

export async function fetchFileTree(): Promise<IFile[]> {
    return listFilesChunked('')
}

export async function fetchSearchFiles(q: string): Promise<IFile[]> {
    const trimmed = q.trim()
    if (!trimmed) {
        return []
    }
    return listFilesChunked(trimmed)
}

export function useFileTree() {
    const { isSignedIn } = useGoogleAuth()

    return useQuery({
        queryKey: queryKeys.filesTree,
        queryFn: fetchFileTree,
        enabled: isSignedIn,
        staleTime: TREE_STALE_TIME,
    })
}

export function useSearchFiles(q: string) {
    const { isSignedIn } = useGoogleAuth()
    const trimmed = q.trim()

    return useQuery({
        queryKey: queryKeys.filesSearch(trimmed),
        queryFn: () => fetchSearchFiles(trimmed),
        enabled: isSignedIn && trimmed.length > 0,
    })
}

export function useRootFolderId(): string | null {
    const { data } = useQuery({
        queryKey: queryKeys.rootFolderId,
        queryFn: () =>
            queryClient.getQueryData<string | null>(queryKeys.rootFolderId) ??
            null,
        staleTime: Infinity,
    })
    return data ?? null
}
