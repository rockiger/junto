import React from 'react'
import { CheckListItem } from './CheckListNode'
import { isEnterWithoutControlOrCommand } from '../../utils/keyboard-utils'

export const checkListPlugin = {
    renderBlock(props, editor, next) {
        switch (props.node.type) {
            case 'check-list-item':
                return <CheckListItem {...props} />
            default:
                return next()
        }
    },
    /**
     * On key down...
     *
     * If enter is pressed inside of a check list item, make sure that when it
     * is split the new item starts unchecked.
     *
     * If backspace is pressed when collapsed at the start of a check list item,
     * then turn it back into a paragraph.
     *
     * @param {Event} event
     * @param {Editor} editor
     * @param {Function} next
     */

    onKeyDown(event, editor, next) {
        const { value } = editor
        const { startBlock } = value

        const keyboardEvent = {
            key: event.key,
            blockType: startBlock.type,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
        }
        if (isEnterWithoutControlOrCommand('code', keyboardEvent)) {
            editor.splitBlock().setBlocks({ data: { checked: false } })
            return
        }

        if (
            event.key === 'Backspace' &&
            value.isCollapsed &&
            value.startBlock.type === 'check-list-item' &&
            value.selection.startOffset === 0
        ) {
            editor.setBlocks('paragraph')
            return
        }

        next()
    },
}
