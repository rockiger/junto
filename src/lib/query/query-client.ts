import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { seedQueryCacheFromLegacyPersist } from './migrate-legacy-persist'

export const QUERY_PERSIST_KEY = '@junto-query'
const TREE_STALE_TIME = 5 * 60 * 1000

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: TREE_STALE_TIME,
            gcTime: 24 * 60 * 60 * 1000,
        },
    },
})

seedQueryCacheFromLegacyPersist((key, data) => {
    queryClient.setQueryData(key, data)
})

export const queryPersister = createSyncStoragePersister({
    storage: window.localStorage,
    key: QUERY_PERSIST_KEY,
})

export const queryPersistDehydrateOptions = {
    shouldDehydrateQuery: (query: { queryKey: readonly unknown[] }) => {
        const key = query.queryKey
        return (
            (key[0] === 'files' &&
                (key[1] === 'tree' || key[1] === 'search')) ||
            (key[0] === 'drive' && key[1] === 'rootFolderId')
        )
    },
}
