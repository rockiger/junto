import { listFilesChunked } from 'lib/gdrive'
import type { IFile } from 'types/app-state'

export { fetchSearchFiles } from 'lib/query/files-queries'

/**
 * @deprecated Use fetchSearchFiles from lib/query/files-queries instead.
 */
export async function fetchSearchResults(query: string): Promise<IFile[]> {
    const trimmed = query.trim()
    if (!trimmed) {
        return []
    }
    return listFilesChunked(trimmed)
}
