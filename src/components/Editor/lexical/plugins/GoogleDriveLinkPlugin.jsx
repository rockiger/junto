import { $isLinkNode } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $dfs } from '@lexical/utils'
import { getFileDescription } from 'lib/gdrive'
import { $getRoot } from 'lexical'
import { useEffect } from 'react'
import {
    classifyLinkUrl,
    googleIconUrlForMime,
} from '../lib/classifyLinkUrl'
import { decorateDriveLink } from '../lib/decorateDriveLink'

const iconCache = new Map()
const pendingFetches = new Map()

async function resolveDriveFileIcon(fileId) {
    if (iconCache.has(fileId)) {
        return iconCache.get(fileId)
    }

    const file = await getFileDescription(fileId)
    const iconUrl =
        file?.iconLink ||
        (file?.mimeType
            ? googleIconUrlForMime(file.mimeType)
            : googleIconUrlForMime('application/octet-stream'))

    iconCache.set(fileId, iconUrl)
    return iconUrl
}

function $getAllLinkNodes() {
    const links = []
    for (const { node } of $dfs($getRoot())) {
        if ($isLinkNode(node)) {
            links.push(node)
        }
    }
    return links
}

function fetchDriveFileIcon(fileId, onResolved) {
    if (iconCache.has(fileId)) {
        onResolved(fileId, iconCache.get(fileId))
        return
    }
    if (pendingFetches.has(fileId)) {
        pendingFetches.get(fileId).push(onResolved)
        return
    }

    pendingFetches.set(fileId, [onResolved])
    resolveDriveFileIcon(fileId)
        .then(iconUrl => {
            const waiters = pendingFetches.get(fileId) || []
            pendingFetches.delete(fileId)
            for (const waiter of waiters) {
                waiter(fileId, iconUrl)
            }
        })
        .catch(() => {
            pendingFetches.delete(fileId)
        })
}

/**
 * Keeps Google Drive link icons in sync and resolves MIME-specific icons for
 * `drive.google.com/file/...` URLs via the Drive API (presentation only).
 */
export default function GoogleDriveLinkPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        const decorateLinks = () => {
            editor.getEditorState().read(() => {
                const links = $getAllLinkNodes()
                for (const link of links) {
                    const dom = editor.getElementByKey(link.getKey())
                    if (!dom) continue

                    const info = decorateDriveLink(dom, link.getURL())
                    if (!info?.needsFetch || !info.fileId) continue

                    fetchDriveFileIcon(info.fileId, (fileId, iconUrl) => {
                        editor.getEditorState().read(() => {
                            for (const node of $getAllLinkNodes()) {
                                const nodeInfo = classifyLinkUrl(node.getURL())
                                if (nodeInfo?.fileId !== fileId) continue
                                const anchor = editor.getElementByKey(node.getKey())
                                if (anchor) {
                                    anchor.style.setProperty(
                                        '--drive-link-icon',
                                        `url("${iconUrl}")`
                                    )
                                }
                            }
                        })
                    })
                }
            })
        }

        decorateLinks()
        return editor.registerUpdateListener(() => {
            decorateLinks()
        })
    }, [editor])

    return null
}
