import React from 'react'
import { Block } from 'slate'

import { getEventRange, getEventTransfer } from 'slate-react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'

const ImageNode = props => {
    const { attributes, node, isFocused } = props
    const src = node.data.get('src')
    //const alt = node.data.get('alt')
    return (
        <img
            alt=""
            src={src}
            style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '20em',
                boxShadow: isFocused ? '0 0 0 2px blue' : 'none',
            }}
            selected={isFocused}
            {...attributes}
        />
    )
}

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

function isImage(url) {
    return !!imageExtensions.find(url.endsWith)
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Range} target
 */

function insertImage(change, src, target) {
    if (target) {
        change.select(target)
    }

    change.insertBlock({
        type: 'image',
        data: { src },
    })
}

/**
 * On drop, insert the image wherever it is dropped.
 *
 * @param {Event} event
 * @param {Change} change
 * @param {Editor} editor
 */

const onImageDrop = (event, change, editor) => {
    const target = getEventRange(event, change.value)
    if (!target && event.type === 'drop') return

    const transfer = getEventTransfer(event)
    const { type, text, files } = transfer

    if (type === 'files') {
        for (const file of files) {
            const reader = new FileReader()
            const [mime] = file.type.split('/')
            if (mime !== 'image') continue

            reader.addEventListener('load', () => {
                editor.change(c => {
                    c.call(insertImage, reader.result, target)
                })
            })

            reader.readAsDataURL(file)
        }
    }

    if (type === 'text') {
        if (!isUrl(text)) return
        if (!isImage(text)) return
        change.call(insertImage, text, target)
    }
}

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
    document: {
        last: { type: 'paragraph' },
        normalize: (change, { code, node, child }) => {
            // eslint-disable-next-line
            switch (code) {
                case 'last_child_type_invalid': {
                    const paragraph = Block.create('paragraph')
                    return change.insertNodeByKey(
                        node.key,
                        node.nodes.size,
                        paragraph
                    )
                }
            }
        },
    },
    blocks: {
        image: {
            isVoid: true,
        },
    },
}

export { ImageNode, onImageDrop, schema }
