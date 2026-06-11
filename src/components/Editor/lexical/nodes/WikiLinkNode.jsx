import { LinkNode } from '@lexical/link'
import { $applyNodeReplacement } from 'lexical'
import { decorateDriveLink, undecorateDriveLink } from '../lib/decorateDriveLink'

/**
 * LinkNode with editor-only Google Drive / Docs pill styling resolved from the URL.
 * Markdown export still emits a normal `[text](url)` via inherited LinkNode behaviour.
 */
export class WikiLinkNode extends LinkNode {
    static getType() {
        return 'wiki-link'
    }

    static clone(node) {
        return new WikiLinkNode(
            node.__url,
            { rel: node.__rel, target: node.__target, title: node.__title },
            node.__key
        )
    }

    createDOM(config) {
        const element = super.createDOM(config)
        decorateDriveLink(element, this.__url)
        return element
    }

    updateDOM(prevNode, anchor, config) {
        const result = super.updateDOM(prevNode, anchor, config)
        if (!prevNode || prevNode.__url !== this.__url) {
            undecorateDriveLink(anchor)
        }
        decorateDriveLink(anchor, this.__url)
        return result
    }

    static importJSON(serializedNode) {
        return $createWikiLinkNode().updateFromJSON(serializedNode)
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'wiki-link',
        }
    }
}

export function $createWikiLinkNode(url = '', attributes = {}) {
    return $applyNodeReplacement(new WikiLinkNode(url, attributes))
}

export function $isWikiLinkNode(node) {
    return node instanceof WikiLinkNode
}
