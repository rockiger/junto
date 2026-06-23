import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { mergeRegister } from '@lexical/utils'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import {
    $insertNodes,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    createCommand,
    PASTE_COMMAND,
} from 'lexical'
import { useEffect } from 'react'
import { $createImageNode, ImageNode } from '../nodes/ImageNode'

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND')

function isImageUrl(url) {
    try {
        return imageExtensions.includes(
            new URL(url).pathname.split('.').pop()
        )
    } catch {
        return false
    }
}

/**
 * Inserting images via command, plus the old Slate behavior:
 * dropped/pasted image files become data URLs, pasted image URLs become images.
 */
export default function ImagesPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor')
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                payload => {
                    $insertNodes([$createImageNode(payload)])
                    return true
                },
                COMMAND_PRIORITY_EDITOR
            ),
            editor.registerCommand(
                DRAG_DROP_PASTE,
                files => {
                    let handled = false
                    for (const file of files) {
                        const [mime] = file.type.split('/')
                        if (mime !== 'image') continue
                        handled = true
                        const reader = new FileReader()
                        reader.addEventListener('load', () => {
                            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                                src: reader.result,
                            })
                        })
                        reader.readAsDataURL(file)
                    }
                    return handled
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                PASTE_COMMAND,
                event => {
                    const text =
                        event instanceof ClipboardEvent
                            ? event.clipboardData?.getData('text/plain')
                            : null
                    if (!text || !isUrl(text) || !isImageUrl(text)) {
                        return false
                    }
                    event.preventDefault()
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: text })
                    return true
                },
                COMMAND_PRIORITY_LOW
            )
        )
    }, [editor])

    return null
}
