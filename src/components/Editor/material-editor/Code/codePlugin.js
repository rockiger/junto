import React from 'react'
import { getEventTransfer } from 'slate-react'
import { isCodeHotkey } from 'is-hotkey'

import { CodeBlock, CodeBlockLine } from './CodeNode'
import { capitalize, replaceMod, toggleBlock } from '../Block'

export const codeBlockPlugin = CodePlugin()

function CodePlugin() {
    const type = 'code'
    const shortcut = 'mod+shift+0'
    const isHotkey = isCodeHotkey(shortcut)

    return {
        onKeyDown(event, editor, next) {
            const { value } = editor
            const { startBlock } = value
            if (event.key === 'Enter' && startBlock.type === 'code') {
                editor.insertText('\n')
                return
            } else if (event.key === 'Tab' && startBlock.type === 'code') {
                event.preventDefault()
                editor.insertText('    ')
                return
            } else if (isHotkey(event)) {
                event.preventDefault()
                toggleBlock(type, editor)
            } else {
                return next()
            }
        },
        onPaste(event, editor, next) {
            const { value } = editor
            const { startBlock } = value

            const transfer = getEventTransfer(event)
            const { text } = transfer
            if (startBlock.type === 'code') {
                editor.insertText(text)
            } else {
                return next()
            }
        },
        shortcut: capitalize(replaceMod(shortcut)),
        renderBlock(props, _editor, next) {
            const { node } = props
            switch (node.type) {
                case 'code':
                    return <CodeBlock {...props} />

                case 'code_line':
                    return <CodeBlockLine {...props} />

                default:
                    return next()
            }
        },
    }
}
