import { $isListItemNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { calculateZoomLevel, isHTMLElement, mergeRegister } from '@lexical/utils'
import {
    $addUpdateTag,
    $getNearestNodeFromDOMNode,
    SKIP_DOM_SELECTION_TAG,
    SKIP_SELECTION_FOCUS_TAG,
} from 'lexical'
import { useEffect } from 'react'

const DEDUP_WINDOW_MS = 500

function isWithinDedupWindow(event) {
    const target = event.target
    if (!isHTMLElement(target)) {
        return false
    }
    const last = target.__lexicalCheckListLastHandled
    return last !== undefined && event.timeStamp - last < DEDUP_WINDOW_MS
}

function recordHandled(event) {
    const target = event.target
    if (isHTMLElement(target)) {
        target.__lexicalCheckListLastHandled = event.timeStamp
    }
}

function findCheckListItemElement(target) {
    let node = target
    while (node != null) {
        if (!isHTMLElement(node)) {
            return null
        }
        if (node.tagName === 'LI') {
            const parent = node.parentNode
            if (parent?.__lexicalListType === 'check') {
                return node
            }
            return null
        }
        node = node.parentNode
    }
    return null
}

function handleCheckItemEvent(event, listItem, callback) {
    const firstChild = listItem.firstChild

    if (
        isHTMLElement(firstChild) &&
        (firstChild.tagName === 'UL' || firstChild.tagName === 'OL')
    ) {
        return
    }

    let clientX = null
    let pointerType = null

    if ('clientX' in event) {
        clientX = event.clientX
    } else if ('touches' in event) {
        const touches = event.touches
        if (touches.length > 0) {
            clientX = touches[0].clientX
            pointerType = 'touch'
        }
    }

    if (clientX == null) {
        return
    }

    const rect = listItem.getBoundingClientRect()
    const zoom = calculateZoomLevel(listItem)
    const clientXInPixels = clientX / zoom

    const beforeStyles = window.getComputedStyle
        ? window.getComputedStyle(listItem, '::before')
        : { width: '0px' }
    const beforeWidthInPixels = parseFloat(beforeStyles.width)

    const isTouchEvent =
        pointerType === 'touch' ||
        ('pointerType' in event && event.pointerType === 'touch')
    const clickAreaPadding = isTouchEvent ? 32 : 0

    if (
        listItem.dir === 'rtl'
            ? clientXInPixels < rect.right + clickAreaPadding &&
              clientXInPixels >
                  rect.right - beforeWidthInPixels - clickAreaPadding
            : clientXInPixels > rect.left - clickAreaPadding &&
              clientXInPixels < rect.left + beforeWidthInPixels + clickAreaPadding
    ) {
        callback()
    }
}

function toggleCheckListItem(editor, listItem) {
    editor.update(() => {
        const node = $getNearestNodeFromDOMNode(listItem)

        if ($isListItemNode(node)) {
            $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
            $addUpdateTag(SKIP_DOM_SELECTION_TAG)
            node.toggleChecked()
        }
    })
}

function handleToggleEvent(event, editor) {
    const listItem = findCheckListItemElement(event.target)
    if (listItem == null) {
        return
    }

    handleCheckItemEvent(event, listItem, () => {
        event.preventDefault()
        event.stopPropagation()
        toggleCheckListItem(editor, listItem)
    })
}

/**
 * Checklist toggles in read-only mode. Lexical's CheckListPlugin suppresses
 * click (via mousedown preventDefault) and skips toggles when not editable.
 */
export default function ReadOnlyCheckListPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        const handlePointerUp = event => {
            if (event.pointerType !== 'touch') {
                return
            }
            if (isWithinDedupWindow(event)) {
                return
            }
            recordHandled(event)
            handleToggleEvent(event, editor)
        }

        const handlePointerDown = event => {
            if (isWithinDedupWindow(event)) {
                return
            }
            recordHandled(event)
            handleToggleEvent(event, editor)
        }

        return mergeRegister(
            editor.registerRootListener(rootElement => {
                if (rootElement === null) {
                    return undefined
                }

                rootElement.addEventListener('pointerup', handlePointerUp)
                rootElement.addEventListener('pointerdown', handlePointerDown, {
                    capture: true,
                })
                rootElement.addEventListener('mousedown', handlePointerDown, {
                    capture: true,
                })
                rootElement.addEventListener('touchstart', handlePointerDown, {
                    capture: true,
                    passive: false,
                })

                return () => {
                    rootElement.removeEventListener(
                        'pointerup',
                        handlePointerUp
                    )
                    rootElement.removeEventListener(
                        'pointerdown',
                        handlePointerDown,
                        { capture: true }
                    )
                    rootElement.removeEventListener(
                        'mousedown',
                        handlePointerDown,
                        { capture: true }
                    )
                    rootElement.removeEventListener(
                        'touchstart',
                        handlePointerDown,
                        { capture: true }
                    )
                }
            })
        )
    }, [editor])

    return null
}
