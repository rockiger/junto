import { classifyLinkUrl } from './classifyLinkUrl'

const KIND_CLASS_PREFIX = 'lexical-drive-link--'

export function undecorateDriveLink(anchor) {
    anchor.classList.remove('lexical-drive-link')
    for (const cls of [...anchor.classList]) {
        if (cls.startsWith(KIND_CLASS_PREFIX)) {
            anchor.classList.remove(cls)
        }
    }
    anchor.style.removeProperty('--drive-link-icon')
    delete anchor.dataset.driveLinkFileId
}

/**
 * Apply presentation-only pill + icon styling from the URL.
 * Uses CSS ::before so Lexical child reconciliation is unaffected.
 *
 * @returns {ReturnType<typeof classifyLinkUrl>}
 */
export function decorateDriveLink(anchor, url) {
    const info = classifyLinkUrl(url)
    if (!info) {
        undecorateDriveLink(anchor)
        return null
    }

    undecorateDriveLink(anchor)
    anchor.classList.add('lexical-drive-link', `${KIND_CLASS_PREFIX}${info.kind}`)
    if (info.fileId) {
        anchor.dataset.driveLinkFileId = info.fileId
    }
    if (info.iconUrl) {
        anchor.style.setProperty('--drive-link-icon', `url("${info.iconUrl}")`)
    }
    return info
}
