import { getEventTransfer } from 'slate-react'
import Html from 'slate-html-serializer'
import DeepTable from 'slate-deep-table'

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCK_TAGS = {
    p: 'paragraph',
    li: 'list-item',
    ul: 'bulleted-list',
    ol: 'numbered-list',
    blockquote: 'quote',
    pre: 'code',
    h1: 'heading-one',
    h2: 'heading-two',
    h3: 'heading-three',
    h4: 'heading-four',
    h5: 'heading-five',
    h6: 'heading-six',
}

/**
 * Tags to marks.
 *
 * @type {Object}
 */

const MARK_TAGS = {
    strong: 'bold',
    em: 'italic',
    u: 'underline',
    s: 'strikethrough',
    code: 'code',
}

/**
 * Serializer rules.
 *
 * @type {Array}
 */

const RULES = [
    ...DeepTable.makeSerializerRules(),
    {
        deserialize(el, next) {
            const block = BLOCK_TAGS[el.tagName.toLowerCase()]

            if (block) {
                return {
                    object: 'block',
                    type: block,
                    nodes: next(el.childNodes),
                }
            }
        },
    },
    {
        deserialize(el, next) {
            const mark = MARK_TAGS[el.tagName.toLowerCase()]

            if (mark) {
                return {
                    object: 'mark',
                    type: mark,
                    nodes: next(el.childNodes),
                }
            }
        },
    },
    {
        // Special case for code blocks, which need to grab the nested childNodes.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'pre') {
                const code = el.childNodes[0]
                const childNodes =
                    code && code.tagName.toLowerCase() === 'code'
                        ? code.childNodes
                        : el.childNodes

                return {
                    object: 'block',
                    type: 'code',
                    nodes: next(childNodes),
                }
            }
        },
    },
    {
        // Special case for images, to grab their src.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'img') {
                return {
                    object: 'block',
                    type: 'image',
                    nodes: next(el.childNodes),
                    data: {
                        src: el.getAttribute('src'),
                    },
                }
            }
        },
    },
    {
        // Special case for links, to grab their href.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'a') {
                return {
                    object: 'inline',
                    type: 'link',
                    nodes: next(el.childNodes),
                    data: {
                        href: el.getAttribute('href'),
                    },
                }
            }
        },
    },
]

/**
 * Create a new HTML serializer with `RULES`.
 *
 * @type {Html}
 */

export const serializer = new Html({ rules: RULES })

/**
 * On paste, deserialize the HTML and then insert the fragment.
 *
 * @param {Event} event
 * @param {Editor} editor
 */

export const onPaste = (event, editor, next) => {
    event.preventDefault()

    const transfer = getEventTransfer(event)
    console.log(transfer)
    if (transfer.type !== 'html') return next()
    const { document } = serializer.deserialize(transfer.html)
    editor.insertFragment(document)
}
