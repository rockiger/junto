import React from 'react'
import imageExtensions from 'image-extensions'

import { DriveNode } from './DriveNode'

export const drivePlugin = {
    onKeyDown(event, editor, next) {
        const { value } = editor
        const { endInline } = value
        if (
            (event.key === 'Backspace' || event.key === 'Delete') &&
            editor.value.inlines.some(inline => inline.type === 'drive-link')
        ) {
            editor.removeNodeByKey(endInline.key)
            return
        } else {
            return next()
        }
    },
    renderInline(props, editor, next) {
        const { node } = props

        switch (node.type) {
            case 'drive-link':
                return <DriveNode editor={editor} {...props} />

            default: {
                return next()
            }
        }
    },
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
