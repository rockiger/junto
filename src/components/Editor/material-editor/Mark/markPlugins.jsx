import { isKeyHotkey, toKeyName } from 'is-hotkey'

export const boldPlugin = MarkPlugin({ key: 'b', type: 'bold' })
export const codePlugin = MarkPlugin({ key: '`', type: 'code' })
export const italicPlugin = MarkPlugin({ key: 'i', type: 'italic' })
export const strikethroughPlugin = MarkPlugin({
    key: '~',
    type: 'strikethrough',
})
export const underlinePlugin = MarkPlugin({ key: 'u', type: 'underline' })

export const markPlugins = [
    boldPlugin,
    codePlugin,
    italicPlugin,
    strikethroughPlugin,
    underlinePlugin,
]

function MarkPlugin(options) {
    const { type, key } = options

    const isHotkey = isKeyHotkey(`mod+${key}`)
    const modifier = toKeyName('mode') === 'meta' ? '⌘' : 'Ctrl'

    return {
        onKeyDown(event, editor, next) {
            if (isHotkey(event)) {
                event.preventDefault()
                editor.toggleMark(type)
            } else {
                return next()
            }
        },
        shortcut: `${modifier}+${capitilize(key)}`,
    }
}

/**
 * Check if the current selection has a mark with `type` in it.
 *
 * @param {String} type
 * @return {Boolean}
 */
export const hasMark = (editor, type) => {
    return editor.value.activeMarks.some(mark => mark.type === type)
}

export function capitilize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
