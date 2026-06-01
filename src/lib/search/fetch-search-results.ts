import { getGlobal, setGlobal } from 'reactn'
import { listFilesChunked, refreshSession } from 'lib/gdrive'

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
        const body =
            err &&
            typeof err === 'object' &&
            'body' in err &&
            typeof (err as { body?: string }).body === 'string'
                ? JSON.parse((err as { body: string }).body)
                : {}
        const error = (body as { error?: { message?: string } }).error
        if (error?.message === 'Invalid Credentials') {
            try {
                await refreshSession()
                await fetchSearchResults(trimmed)
            } catch (refreshErr) {
                const message =
                    refreshErr instanceof Error
                        ? refreshErr.message
                        : String(refreshErr)
                alert(`Couldn't refresh session: ${message}`)
                console.log({ refreshErr })
                setGlobal({ isFileListLoading: false })
            }
        } else {
            alert(`Couldn't load search results ${err}`)
            console.log({ err })
            setGlobal({ isFileListLoading: false })
        }
    }
}
