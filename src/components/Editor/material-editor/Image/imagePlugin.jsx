import React from 'react'
import { getEventTransfer } from 'slate-react'
import isUrl from 'is-url'
import imageExtensions from 'image-extensions'

import { ImageBlock } from './ImageNode'

export const imagePlugin = ImagePlugin()

function ImagePlugin() {
    return {
        onPaste: onDropOrPaste,
        onDrop: onDropOrPaste,
        renderBlock(props, editor, next) {
            const { node } = props

            switch (node.type) {
                case 'image':
                    return <ImageBlock {...props} />

                default: {
                    return next()
                }
            }
        },
    }
}

/**
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

export function isImage(url) {
    return imageExtensions.includes(getExtension(url))
}

/**
 * Get the extension of the URL, using the URL API.
 *
 * @param {String} url
 * @return {String}
 */

export function getExtension(url) {
    return new URL(url).pathname.split('.').pop()
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */

export function insertImage(editor, src, target) {
    if (target) {
        editor.select(target)
    }

    editor.insertBlock({
        type: 'image',
        data: { src },
    })
}

function onDropOrPaste(event, editor, next) {
    const target = editor.findEventRange(event)
    if (!target && event.type === 'drop') return next()

    const transfer = getEventTransfer(event)
    const { type, text, files } = transfer

    if (type === 'files') {
        // eslint-disable-next-line
        for (const file of files) {
            const reader = new FileReader()
            const [mime] = file.type.split('/')
            if (mime !== 'image') continue

            reader.addEventListener('load', () => {
                editor.command(insertImage, reader.result, target)
            })

            reader.readAsDataURL(file)
        }
        return
    }

    if (type === 'text') {
        if (!isUrl(text)) return next()
        if (!isImage(text)) return next()
        editor.command(insertImage, text, target)
        return
    }

    next()
}
