import React from 'react'
import { hasBlock } from './blockPlugins'

import { ToolbarButton } from '../Toolbar/Toolbar-container'

export const DEFAULT_NODE = 'paragraph'

export const QuoteBlock = props => {
    return <blockquote {...props.attributes}>{props.children}</blockquote>
}

export const BulletedListBlock = props => {
    return <ul {...props.attributes}>{props.children}</ul>
}

export const Heading1Block = props => {
    return <h1 {...props.attributes}>{props.children}</h1>
}

export const Heading2Block = props => {
    return <h2 {...props.attributes}>{props.children}</h2>
}

export const Heading3Block = props => {
    return <h3 {...props.attributes}>{props.children}</h3>
}

export const Heading4Block = props => {
    return <h4 {...props.attributes}>{props.children}</h4>
}

export const Heading5Block = props => {
    return <h5 {...props.attributes}>{props.children}</h5>
}

export const Heading6Block = props => {
    return <h6 {...props.attributes}>{props.children}</h6>
}

export const ListItemBlock = props => {
    return <li {...props.attributes}>{props.children}</li>
}

export const NumberedListBlock = props => {
    return <ol {...props.attributes}>{props.children}</ol>
}

export const ParagraphBlock = props => {
    return <p {...props.attributes}>{props.children}</p>
}

// Add a 'renderBlock' mehod to render a 'CodeNode' for code blocks
export function renderBlock(props, _editor, next) {
    const { node } = props
    switch (node.type) {
        case 'block-quote':
            return <QuoteBlock {...props} />

        case 'bulleted-list':
            return <BulletedListBlock {...props} />

        case 'heading-one':
            return <Heading1Block {...props} />

        case 'heading-two':
            return <Heading2Block {...props} />

        case 'heading-three':
            return <Heading3Block {...props} />

        case 'heading-four':
            return <Heading4Block {...props} />

        case 'heading-five':
            return <Heading5Block {...props} />

        case 'heading-six':
            return <Heading6Block {...props} />

        case 'list-item':
            return <ListItemBlock {...props} />

        case 'numbered-list':
            return <NumberedListBlock {...props} />

        case 'paragraph':
            return <ParagraphBlock {...props} />

        default:
            return next()
    }
}

/**
 * Render a block-toggling toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @return {Element}
 */

export const renderBlockButton = (editor, value, icon, type, shortcut = '') => {
    let isActive = hasBlock({ value }, type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
        const { document, blocks } = value

        if (blocks.size > 0) {
            const parent = document.getParent(blocks.first().key)
            isActive =
                hasBlock({ value }, 'list-item') &&
                parent &&
                parent.type === type
        }
    }

    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickBlockButton(editor, event, type)}
            shortcut={shortcut}
            value={type}
        >
            {icon}
        </ToolbarButton>
    )
}

/**
 * When a block button is clicked, toggle the block type.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickBlockButton = (editor, event, type) => {
    event.preventDefault()

    const { value } = editor
    const { document } = value

    console.log(document)

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = hasBlock(type)
        const isList = hasBlock('list-item')

        if (isList) {
            editor
                .setBlocks(isActive ? DEFAULT_NODE : type)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list')
        } else {
            editor.setBlocks(isActive ? DEFAULT_NODE : type)
        }
    } else {
        // Handle the extra wrapping required for list buttons.
        const isList = hasBlock('list-item')
        const isType = value.blocks.some(block => {
            return !!document.getClosest(
                block.key,
                parent => parent.type === type
            )
        })

        if (isList && isType) {
            editor
                .setBlocks(DEFAULT_NODE)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list')
        } else if (isList) {
            editor
                .unwrapBlock(
                    type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                )
                .wrapBlock(type)
        } else {
            editor.setBlocks('list-item').wrapBlock(type)
        }
    }
}
