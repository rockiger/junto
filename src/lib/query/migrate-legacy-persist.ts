import type { IFile } from 'types/app-state'

import { queryKeys } from './query-keys'

const LEGACY_PERSIST_KEY = '@reactn'
const MIGRATION_FLAG_KEY = '@junto-query-migrated'

type LegacyPersistState = {
    initialFiles?: IFile[]
    rootFolderId?: string | null
}

/**
 * One-time seed from the legacy Zustand persist key into the Query cache
 * before persistQueryClient hydrates.
 */
export function seedQueryCacheFromLegacyPersist(
    setQueryData: (key: readonly unknown[], data: unknown) => void,
): void {
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
        return
    }

    try {
        const raw = localStorage.getItem(LEGACY_PERSIST_KEY)
        if (!raw) {
            localStorage.setItem(MIGRATION_FLAG_KEY, '1')
            return
        }

        const parsed = JSON.parse(raw) as
            | LegacyPersistState
            | { state?: LegacyPersistState }

        const state =
            parsed && typeof parsed === 'object' && 'state' in parsed
                ? parsed.state
                : (parsed as LegacyPersistState)

        if (state?.initialFiles?.length) {
            setQueryData(queryKeys.filesTree, state.initialFiles)
        }
        if (state?.rootFolderId) {
            setQueryData(queryKeys.rootFolderId, state.rootFolderId)
        }

        localStorage.setItem(MIGRATION_FLAG_KEY, '1')
    } catch {
        localStorage.setItem(MIGRATION_FLAG_KEY, '1')
    }
}
