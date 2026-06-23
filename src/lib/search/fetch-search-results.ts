import { getGlobal, setGlobal } from 'reactn'
import { listFilesChunked } from 'lib/gdrive'

let activeRequestId = 0

/**
 * Load Drive search results into global `files` (search results only).
 * Empty query clears results without an API call.
 */
export async function fetchSearchResults(query: string): Promise<void> {
    const trimmed = query.trim()
    const requestId = ++activeRequestId

    if (!trimmed) {
        setGlobal({
            files: [],
            isFileListLoading: false,
        })
        return
    }

    const { isSignedIn } = getGlobal()
    if (!isSignedIn) {
        return
    }

    setGlobal({ isFileListLoading: true })

    try {
        const files = await listFilesChunked(trimmed)
        if (requestId !== activeRequestId) {
            return
        }
        setGlobal({
            files,
            isFileListLoading: false,
        })
    } catch (err: unknown) {
        if (requestId !== activeRequestId) {
            return
        }
        const message = err instanceof Error ? err.message : String(err)
        alert(`Couldn't load search results: ${message}`)
        console.log({ err })
        setGlobal({ isFileListLoading: false })
    }
}
