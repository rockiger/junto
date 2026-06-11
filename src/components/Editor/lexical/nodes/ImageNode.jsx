import Skeleton from '@material-ui/lab/Skeleton'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'
import React, { useState } from 'react'

function ImageComponent({ src, altText, nodeKey }) {
    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey)
    const [loading, setLoading] = useState(true)
    return (
        <>
            <Skeleton
                variant="rect"
                style={{
                    display: loading ? 'block' : 'none',
                    height: '10rem',
                    width: '20em',
                }}
            />
            <img
                src={src}
                alt={altText}
                draggable="false"
                onClick={event => {
                    if (!event.shiftKey) clearSelection()
                    setSelected(!isSelected)
                }}
                style={{
                    display: loading ? 'none' : 'block',
                    maxHeight: '20em',
                    maxWidth: '100%',
                    boxShadow: isSelected ? '0 0 0 1px blue' : 'none',
                }}
                onLoad={() => setLoading(false)}
            />
        </>
    )
}

function $convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const { src, alt } = domNode
        return { node: $createImageNode({ altText: alt, src }) }
    }
    return null
}

export class ImageNode extends DecoratorNode {
    static getType() {
        return 'image'
    }

    static clone(node) {
        return new ImageNode(node.__src, node.__altText, node.__key)
    }

    static importJSON(serializedNode) {
        const { src, altText } = serializedNode
        return $createImageNode({ altText, src }).updateFromJSON(
            serializedNode
        )
    }

    static importDOM() {
        return {
            img: () => ({
                conversion: $convertImageElement,
                priority: 0,
            }),
        }
    }

    constructor(src, altText = '', key) {
        super(key)
        this.__src = src
        this.__altText = altText
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            altText: this.__altText,
            src: this.__src,
        }
    }

    exportDOM() {
        const element = document.createElement('img')
        element.setAttribute('src', this.__src)
        element.setAttribute('alt', this.__altText)
        return { element }
    }

    createDOM(config) {
        const span = document.createElement('span')
        const className = config.theme.image
        if (className !== undefined) {
            span.className = className
        }
        return span
    }

    updateDOM() {
        return false
    }

    getSrc() {
        return this.__src
    }

    getAltText() {
        return this.__altText
    }

    decorate() {
        return (
            <ImageComponent
                src={this.__src}
                altText={this.__altText}
                nodeKey={this.getKey()}
            />
        )
    }
}

export function $createImageNode({ src, altText = '', key } = {}) {
    return $applyNodeReplacement(new ImageNode(src, altText, key))
}

export function $isImageNode(node) {
    return node instanceof ImageNode
}
