import { isCodeHotkey, toKeyName } from 'is-hotkey'
import { checkListPlugin } from './CheckList'

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

export const h1Plugin = BlockPlugin({
    shortcut: 'mod+alt+1',
    type: 'heading-one',
})
export const h2Plugin = BlockPlugin({
    shortcut: 'mod+alt+2',
    type: 'heading-two',
})

export const h3Plugin = BlockPlugin({
    shortcut: 'mod+alt+3',
    type: 'heading-three',
})
export const h4Plugin = BlockPlugin({
    shortcut: 'mod+alt+4',
    type: 'heading-four',
})

export const h5Plugin = BlockPlugin({
    shortcut: 'mod+alt+5',
    type: 'heading-five',
})
export const h6Plugin = BlockPlugin({
    shortcut: 'mod+alt+6',
    type: 'heading-six',
})
export const blistPlugin = BlockPlugin({
    shortcut: 'mod+shift+8',
    type: 'bulleted-list',
})
export const nlistPlugin = BlockPlugin({
    shortcut: 'mod+shift+7',
    type: 'numbered-list',
})
export const quotePlugin = BlockPlugin({
    shortcut: 'mod+shift+9',
    type: 'block-quote',
})

export const blockPlugins = [
    h1Plugin,
    h2Plugin,
    h3Plugin,
    h4Plugin,
    h5Plugin,
    h6Plugin,
    blistPlugin,
    nlistPlugin,
    quotePlugin,
    checkListPlugin,
]

function BlockPlugin(options) {
    const { type, shortcut } = options

    const isHotkey = isCodeHotkey(shortcut)

    return {
        onKeyDown(event, editor, next) {
            if (isHotkey(event)) {
                event.preventDefault()
                toggleBlock(type, editor)
            } else {
                return next()
            }
        },
        shortcut: capitalize(replaceMod(shortcut)),
    }
}

export function toggleBlock(type, editor) {
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = hasBlock(editor, type)
        const isList = hasBlock(editor, 'list-item')

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
        const isList = hasBlock(editor, 'list-item')
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

/**
 * Check if the any of the currently selected blocks are of `type`.
 *
 * @param {String} type
 * @return {Boolean}
 */

export const hasBlock = (editor, type) => {
    return editor.value.blocks.some(node => node.type === type)
}
export function replaceMod(str) {
    const modKey = toKeyName('mod') === 'meta' ? '⌘' : 'Ctrl'

    return str.replace(/mod/, modKey)
}

export function capitalize(str) {
    str = str.split('+')

    for (let i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1)
    }

    return str.join('+')
}
