import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { eventFiles } from '@lexical/rich-text'
import { calculateZoomLevel, isHTMLElement, mergeRegister } from '@lexical/utils'
import {
	$getNearestNodeFromDOMNode,
	$getNodeByKey,
	$getSelection,
	$onUpdate,
	BLUR_COMMAND,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DRAGOVER_COMMAND,
	DROP_COMMAND,
	IS_FIREFOX,
} from 'lexical'
import {
	type DragEvent as ReactDragEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
	$getWikiBlockElement,
	$insertDraggedCheckListNode,
	$isCheckListItem,
	DRAG_DATA_FORMAT,
	getCollapsedMarginsForElement,
	getWikiBlockElement,
} from './checkListDragUtils'

const SPACE = 4
const TARGET_LINE_HALF_HEIGHT = 2
const TEXT_BOX_HORIZONTAL_PADDING = 28

function setMenuPosition(
	targetElem: HTMLElement | null,
	floatingElem: HTMLElement,
	anchorElem: HTMLElement,
	zoomLevel: number,
) {
	if (!targetElem) {
		floatingElem.style.display = 'none'
		return
	}

	const targetRect = targetElem.getBoundingClientRect()
	const targetStyle = window.getComputedStyle(targetElem)
	const floatingElemRect = floatingElem.getBoundingClientRect()
	const anchorElementRect = anchorElem.getBoundingClientRect()

	let targetCalculateHeight = Number.parseInt(targetStyle.lineHeight, 10)
	if (Number.isNaN(targetCalculateHeight)) {
		targetCalculateHeight = targetRect.bottom - targetRect.top
	}

	const top =
		(targetRect.top +
			(targetCalculateHeight -
				(floatingElemRect.height || targetCalculateHeight)) /
				2 -
			anchorElementRect.top +
			anchorElem.scrollTop) /
		zoomLevel

	floatingElem.style.display = 'flex'
	floatingElem.style.opacity = '1'
	floatingElem.style.transform = `translate(${SPACE}px, ${top}px)`
}

function setDragImage(
	dataTransfer: DataTransfer,
	draggableBlockElem: HTMLElement,
) {
	const { transform } = draggableBlockElem.style
	draggableBlockElem.style.transform = 'translateZ(0)'
	dataTransfer.setDragImage(draggableBlockElem, 0, 0)
	setTimeout(() => {
		draggableBlockElem.style.transform = transform
	}, 0)
}

function setTargetLine(
	targetLineElem: HTMLElement,
	targetBlockElem: HTMLElement,
	mouseY: number,
	anchorElem: HTMLElement,
) {
	const { top: targetBlockElemTop, height: targetBlockElemHeight } =
		targetBlockElem.getBoundingClientRect()
	const { top: anchorTop, width: anchorWidth } =
		anchorElem.getBoundingClientRect()
	const { marginTop, marginBottom } =
		getCollapsedMarginsForElement(targetBlockElem)

	let lineTop = targetBlockElemTop
	if (mouseY >= targetBlockElemTop) {
		lineTop += targetBlockElemHeight + marginBottom / 2
	} else {
		lineTop -= marginTop / 2
	}

	const top =
		lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT + anchorElem.scrollTop
	const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE

	targetLineElem.style.transform = `translate(${left}px, ${top}px)`
	targetLineElem.style.width = `${
		anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2
	}px`
	targetLineElem.style.opacity = '0.4'
}

function hideTargetLine(targetLineElem: HTMLElement | null) {
	if (!targetLineElem) return
	targetLineElem.style.opacity = '0'
	targetLineElem.style.transform = 'translate(-10000px, -10000px)'
}

export interface WikiDraggableBlockPluginProps {
	anchorElem: HTMLElement
	isOnMenu: (element: HTMLElement) => boolean
	menuComponent: ReactNode
	menuRef: React.RefObject<HTMLElement | null>
	onElementChanged?: (element: HTMLElement | null) => void
	targetLineComponent: ReactNode
	targetLineRef: React.RefObject<HTMLElement | null>
}

export function WikiDraggableBlockPlugin({
	anchorElem,
	isOnMenu,
	menuComponent,
	menuRef,
	onElementChanged,
	targetLineComponent,
	targetLineRef,
}: WikiDraggableBlockPluginProps) {
	const [editor] = useLexicalComposerContext()
	const scrollerElem = anchorElem.parentElement
	const isDraggingBlockRef = useRef(false)
	const draggedNodeKeyRef = useRef<string | null>(null)
	const [draggableBlockElem, setDraggableBlockElemState] =
		useState<HTMLElement | null>(null)

	const setDraggableBlockElem = useCallback(
		(elem: HTMLElement | null) => {
			setDraggableBlockElemState(elem)
			onElementChanged?.(elem)
		},
		[onElementChanged],
	)

	useEffect(() => {
		function onMouseMove(event: MouseEvent) {
			const target = event.target
			if (!isHTMLElement(target)) {
				setDraggableBlockElem(null)
				return
			}
			if (isOnMenu(target)) return

			setDraggableBlockElem(
				getWikiBlockElement(anchorElem, editor, event, null),
			)
		}

		function onMouseLeave() {
			setDraggableBlockElem(null)
		}

		if (scrollerElem != null) {
			scrollerElem.addEventListener('mousemove', onMouseMove)
			scrollerElem.addEventListener('mouseleave', onMouseLeave)
		}

		return () => {
			if (scrollerElem != null) {
				scrollerElem.removeEventListener('mousemove', onMouseMove)
				scrollerElem.removeEventListener('mouseleave', onMouseLeave)
			}
		}
	}, [scrollerElem, anchorElem, editor, isOnMenu, setDraggableBlockElem])

	useEffect(() => {
		const rootElement = editor.getRootElement()
		const zoomLevel = calculateZoomLevel(rootElement, true)
		if (menuRef.current) {
			setMenuPosition(
				draggableBlockElem,
				menuRef.current,
				anchorElem,
				zoomLevel,
			)
		}
	}, [anchorElem, draggableBlockElem, editor, menuRef])

	useEffect(() => {
		function onDragover(event: DragEvent): boolean {
			if (!isDraggingBlockRef.current) return false
			const [isFileTransfer] = eventFiles(event)
			if (isFileTransfer) return false

			const { pageY, target } = event
			if (!isHTMLElement(target)) return false

			const targetBlockElem = getWikiBlockElement(
				anchorElem,
				editor,
				event,
				draggedNodeKeyRef.current,
				true,
			)
			const targetLineElem = targetLineRef.current
			if (targetBlockElem === null || targetLineElem === null) return false

			setTargetLine(
				targetLineElem,
				targetBlockElem,
				pageY / calculateZoomLevel(target),
				anchorElem,
			)
			event.preventDefault()
			return true
		}

		function onDrop(event: DragEvent): boolean {
			if (!isDraggingBlockRef.current) return false
			const [isFileTransfer] = eventFiles(event)
			if (isFileTransfer) return false

			const { target, dataTransfer, pageY } = event
			const dragData =
				dataTransfer != null ? dataTransfer.getData(DRAG_DATA_FORMAT) : ''
			if (!isHTMLElement(target)) return false

			const draggedNode = $getNodeByKey(dragData)
			if (!draggedNode) return false

			const targetBlockElem = $getWikiBlockElement(
				anchorElem,
				editor,
				event,
				draggedNodeKeyRef.current,
				true,
			)
			if (!targetBlockElem) return false

			const targetNode = $getNearestNodeFromDOMNode(targetBlockElem)
			if (!targetNode) return false
			if (targetNode === draggedNode) {
				if (IS_FIREFOX) editor.focus()
				return true
			}

			const targetBlockElemTop = targetBlockElem.getBoundingClientRect().top
			const isInsertAfter =
				pageY / calculateZoomLevel(target) >= targetBlockElemTop

			if ($isCheckListItem(draggedNode)) {
				$insertDraggedCheckListNode(
					draggedNode,
					targetNode,
					isInsertAfter,
				)
			} else if ($isCheckListItem(targetNode)) {
				const listParent = targetNode.getParentOrThrow()
				if (isInsertAfter) {
					listParent.insertAfter(draggedNode)
				} else {
					listParent.insertBefore(draggedNode)
				}
			} else {
				if (isInsertAfter) {
					targetNode.insertAfter(draggedNode)
				} else {
					targetNode.insertBefore(draggedNode)
				}
			}

			setDraggableBlockElem(null)

			if (IS_FIREFOX) {
				$onUpdate(() => {
					editor.focus()
				})
			}

			return true
		}

		return mergeRegister(
			editor.registerCommand(
				DRAGOVER_COMMAND,
				(event) => onDragover(event),
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				DROP_COMMAND,
				(event) => {
					let handled = false
					editor.update(() => {
						handled = onDrop(event)
					})
					return handled
				},
				COMMAND_PRIORITY_HIGH,
			),
		)
	}, [anchorElem, editor, setDraggableBlockElem, targetLineRef])

	useEffect(() => {
		if (!IS_FIREFOX || !editor._editable) return

		return mergeRegister(
			editor.registerRootListener((rootElement) => {
				function onBlur(event: FocusEvent) {
					const relatedTarget = event.relatedTarget
					if (isHTMLElement(relatedTarget) && isOnMenu(relatedTarget)) {
						rootElement?.focus({ preventScroll: true })
						editor.update(() => {
							const selection = $getSelection()
							if (selection !== null && !selection.dirty) {
								selection.dirty = true
							}
						})
						event.stopImmediatePropagation()
					}
				}

				if (rootElement) {
					rootElement.addEventListener('blur', onBlur, true)
					return () => rootElement.removeEventListener('blur', onBlur, true)
				}
			}),
			editor.registerCommand(
				BLUR_COMMAND,
				() => {
					const rootElement = editor.getRootElement()
					const activeElement = document.activeElement
					if (
						rootElement &&
						isHTMLElement(activeElement) &&
						isOnMenu(activeElement)
					) {
						rootElement.focus({ preventScroll: true })
						editor.update(() => {
							const selection = $getSelection()
							if (selection !== null && !selection.dirty) {
								selection.dirty = true
							}
						})
						return true
					}
					return false
				},
				COMMAND_PRIORITY_HIGH,
			),
		)
	}, [editor, isOnMenu])

	function onDragStart(event: ReactDragEvent<HTMLDivElement>) {
		const dataTransfer = event.dataTransfer
		if (!dataTransfer || !draggableBlockElem) return

		setDragImage(dataTransfer, draggableBlockElem)
		let nodeKey = ''
		editor.update(() => {
			const node = $getNearestNodeFromDOMNode(draggableBlockElem)
			if (node) nodeKey = node.getKey()
		})

		isDraggingBlockRef.current = true
		draggedNodeKeyRef.current = nodeKey
		dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey)

		if (IS_FIREFOX) {
			const rootElement = editor.getRootElement()
			if (rootElement !== null && document.activeElement !== rootElement) {
				rootElement.focus({ preventScroll: true })
				editor.update(() => {
					const selection = $getSelection()
					if (selection !== null && !selection.dirty) {
						selection.dirty = true
					}
				})
			}
		}
	}

	function onDragEnd() {
		isDraggingBlockRef.current = false
		draggedNodeKeyRef.current = null
		hideTargetLine(targetLineRef.current)
		if (IS_FIREFOX) editor.focus()
	}

	return createPortal(
		<>
			<div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
				{editor._editable ? menuComponent : null}
			</div>
			{targetLineComponent}
		</>,
		anchorElem,
	)
}
