import React from 'react'
import { getEventTransfer } from 'slate-react'
import { isKeyHotkey, toKeyName } from 'is-hotkey'
import isUrl from 'is-url'

import { LinkNode } from './link'
import { showModal } from '../Editor/Editor-container'

export const linkPlugin = LinkPlugin({ key: 'k', type: 'link' })

function LinkPlugin(options) {
    const { type, key } = options

    const isHotkey = isKeyHotkey(`mod+${key}`)
    const modifier = toKeyName('mode') === 'meta' ? '⌘' : 'Ctrl'
    console.log(modifier)

    return {
        onKeyDown(event, editor, next) {
            if (isHotkey(event)) {
                event.preventDefault()
                toggleLink(editor, event, type)
            } else {
                return next()
            }
        },
        onPaste(event, editor, next) {
            if (editor.value.selection.isCollapsed) return next()

            const transfer = getEventTransfer(event)
            const { type, text } = transfer

            if (type !== 'text' && type !== 'html') return next()
            if (!isUrl(text)) return next()

            if (hasLinks(editor)) {
                editor.command(unwrapLink)
            }

            editor.command(wrapLink, text)
        },
        shortcut: `${modifier}+${capitilize(key)}`,
        renderInline(props, editor, next) {
            const { attributes, children, node } = props

            switch (node.type) {
                case 'link': {
                    const { data } = node
                    const href = data.get('href')
                    return (
                        <LinkNode
                            showTooltip={hasLinks(editor)}
                            onClickRemove={ev => {
                                ev.preventDefault()
                                editor.command(unwrapLink)
                            }}
                            onClickEdit={async ev => {
                                ev.preventDefault()
                                try {
                                    // get text und href of inline
                                    const inlines = editor.value.inlines
                                    const link = inlines.find(
                                        inline => inline.type === 'link'
                                    )
                                    const text = link.text
                                    const href = link.data.get('href')

                                    // openModal with text and href given
                                    const result = await showModal(text, href)

                                    // Change link if result fulfill requirements
                                    if (!result || !result.href) return
                                    const linkText = result.text
                                        ? result.text
                                        : result.href

                                    editor.setInlines({
                                        type: 'link',
                                        data: {
                                            href: result.href,
                                        },
                                    })

                                    editor
                                        .moveStartToStartOfInline()
                                        .moveEndToEndOfInline()
                                        .insertText(linkText)
                                } catch (err) {
                                    console.log(err)
                                }
                            }}
                            attributes={attributes}
                            href={href}
                            children={children}
                        />
                    )
                }

                default: {
                    return next()
                }
            }
        },
    }
}

/**
 * Check whether the current selection has a link in it.
 *
 * @return {Boolean} hasLinks
 */

export const hasLinks = editor => {
    return editor.value.inlines.some(inline => inline.type === 'link')
}

export async function toggleLink(editor, event, type) {
    if (type === 'link') {
        // TODO refactor to onClickInlinButton
        const { value } = editor
        if (hasLinks(editor)) {
            editor.command(unwrapLink)
        } else {
            const selectedText = value.selection.isExpanded
                ? value.fragment.text
                : ''
            const result = await showModal(selectedText)
            console.log(result)

            if (!result || !result.href) return
            const linkText = result.text ? result.text : result.href
            editor
                .insertText(linkText)
                .moveFocusBackward(linkText.length)
                .command(wrapLink, result.href)
        }
    }
}

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
 * @param {String} href
 */

export function wrapLink(editor, href) {
    console.log('wrapLink')
    editor.wrapInline({
        type: 'link',
        data: { href },
    })

    editor.moveToEnd()
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */

export function unwrapLink(editor) {
    editor.unwrapInline('link')
}

export function capitilize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
