import { LinkNode } from '@lexical/link'
import { $applyNodeReplacement } from 'lexical'
import { classifyLinkUrl } from '../lib/classifyLinkUrl'
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

    applyPresentation(anchor) {
        decorateDriveLink(anchor, this.__url)
        const info = classifyLinkUrl(this.__url)
        if (info?.kind === 'wiki') {
            anchor.removeAttribute('target')
            anchor.removeAttribute('rel')
            return
        }
        if (info) {
            anchor.target = '_blank'
            anchor.rel = 'noopener noreferrer'
        }
    }

    createDOM(config) {
        const element = super.createDOM(config)
        this.applyPresentation(element)
        return element
    }

    updateDOM(prevNode, anchor, config) {
        const result = super.updateDOM(prevNode, anchor, config)
        if (!prevNode || prevNode.__url !== this.__url) {
            undecorateDriveLink(anchor)
        }
        this.applyPresentation(anchor)
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
