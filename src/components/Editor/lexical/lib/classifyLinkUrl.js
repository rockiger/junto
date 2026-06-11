const GOOGLE_ICON_BASE =
    'https://drive-thirdparty.googleusercontent.com/16/type/'

const MIME = {
    document: 'application/vnd.google-apps.document',
    spreadsheet: 'application/vnd.google-apps.spreadsheet',
    presentation: 'application/vnd.google-apps.presentation',
    form: 'application/vnd.google-apps.form',
    folder: 'application/vnd.google-apps.folder',
    generic: 'application/octet-stream',
}

/** Google Drive third-party icon URL for a MIME type (same pattern as Picker `iconUrl`). */
export function googleIconUrlForMime(mimeType) {
    return `${GOOGLE_ICON_BASE}${encodeURIComponent(mimeType)}`
}

/**
 * Classify a link URL for editor-only Google Drive / Docs styling.
 * Returns null for regular links so markdown stays a plain `[text](url)`.
 *
 * @returns {{ kind: string, fileId?: string, iconUrl?: string, needsFetch?: boolean } | null}
 */
export function classifyLinkUrl(url) {
    if (!url || typeof url !== 'string') return null

    const doc = url.match(/docs\.google\.com\/document\/d\/([^/?#]+)/)
    if (doc) {
        return {
            fileId: doc[1],
            iconUrl: googleIconUrlForMime(MIME.document),
            kind: 'document',
        }
    }

    const sheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/)
    if (sheet) {
        return {
            fileId: sheet[1],
            iconUrl: googleIconUrlForMime(MIME.spreadsheet),
            kind: 'spreadsheet',
        }
    }

    const slides = url.match(/docs\.google\.com\/presentation\/d\/([^/?#]+)/)
    if (slides) {
        return {
            fileId: slides[1],
            iconUrl: googleIconUrlForMime(MIME.presentation),
            kind: 'presentation',
        }
    }

    const form = url.match(/docs\.google\.com\/forms\/d\/([^/?#]+)/)
    if (form) {
        return {
            fileId: form[1],
            iconUrl: googleIconUrlForMime(MIME.form),
            kind: 'form',
        }
    }

    const folder = url.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([^/?#]+)/)
    if (folder) {
        return {
            fileId: folder[1],
            iconUrl: googleIconUrlForMime(MIME.folder),
            kind: 'folder',
        }
    }

    const file = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
    if (file) {
        return {
            fileId: file[1],
            iconUrl: googleIconUrlForMime(MIME.generic),
            kind: 'drive-file',
            needsFetch: true,
        }
    }

    const open = url.match(/drive\.google\.com\/open\?[^#]*\bid=([^&]+)/)
    if (open) {
        return {
            fileId: open[1],
            iconUrl: googleIconUrlForMime(MIME.generic),
            kind: 'drive-file',
            needsFetch: true,
        }
    }

    return null
}
