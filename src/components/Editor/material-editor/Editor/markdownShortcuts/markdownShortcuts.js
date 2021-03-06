/**
 * Get the block type for a series of auto-markdown shortcut `chars`.
 *
 * @param {String} chars
 * @return {String} block
 */

const getType = chars => {
    switch (chars) {
        case '*':
        case '-':
        case '+':
            return 'list-item'
        case '>':
            return 'block-quote'
        case '[]':
            return 'check-list-item'
        case '#':
            return 'heading-one'
        case '##':
            return 'heading-two'
        case '###':
            return 'heading-three'
        case '####':
            return 'heading-four'
        case '#####':
            return 'heading-five'
        case '######':
            return 'heading-six'
        case '1.':
            return 'number-item'
        default:
            return null
    }
}

const onSpace = (event, editor, next) => {
    const { value } = editor
    const { selection } = value
    if (selection.isExpanded) return next()

    const { startBlock } = value
    const { start } = selection
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
    let type = getType(chars)
    let isNumbered = false

    if (!type) return next()

    if (type === 'number-item') {
        type = 'list-item'
        isNumbered = true
    }

    if (type === 'list-item' && startBlock.type === 'list-item') return next()
    event.preventDefault()

    editor.setBlocks(type)

    if (type === 'list-item' && !isNumbered) {
        editor.wrapBlock('bulleted-list')
    }
    if (type === 'list-item' && isNumbered) {
        editor.wrapBlock('numbered-list')
    }

    editor.moveFocusToStartOfNode(startBlock).delete()
}

/**
 * On backspace, if at the start of a non-paragraph, convert it back into a
 * paragraph node.
 *
 * @param {Event} event
 * @param {Editor} editor
 * @param {Function} next
 */

const onBackspace = (event, editor, next) => {
    const { value } = editor
    const { selection } = value
    if (selection.isExpanded) return next()
    if (selection.start.offset !== 0) return next()

    const { startBlock } = value
    if (startBlock.type === 'paragraph') return next()

    event.preventDefault()
    editor.setBlocks('paragraph')

    if (startBlock.type === 'list-item') {
        editor.unwrapBlock('bulleted-list').unwrapBlock('numbered-list')
    }
}

/**
 * On return, if at the end of a node type that should not be extended,
 * create a new paragraph below it.
 *
 * @param {Event} event
 * @param {Editor} editor
 * @param {Function} next
 */

const onEnter = (event, editor, next) => {
    const { value } = editor
    const { selection } = value
    const { start, end, isExpanded } = selection
    if (isExpanded) return next()

    const { startBlock } = value
    if (start.offset === 0 && startBlock.text.length === 0)
        return onBackspace(event, editor, next)
    if (end.offset !== startBlock.text.length) return next()

    if (
        startBlock.type !== 'heading-one' &&
        startBlock.type !== 'heading-two' &&
        startBlock.type !== 'heading-three' &&
        startBlock.type !== 'heading-four' &&
        startBlock.type !== 'heading-five' &&
        startBlock.type !== 'heading-six' &&
        startBlock.type !== 'block-quote'
    ) {
        return next()
    }

    event.preventDefault()
    editor.splitBlock().setBlocks('paragraph')
}

export const markdownShortcuts = {
    onKeyDown(event, editor, next) {
        switch (event.key) {
            case ' ':
                return onSpace(event, editor, next)
            case 'Backspace':
                return onBackspace(event, editor, next)
            case 'Enter':
                return onEnter(event, editor, next)
            default:
                return next()
        }
    },
}
