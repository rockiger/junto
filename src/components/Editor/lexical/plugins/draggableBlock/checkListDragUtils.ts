import {
	$createListNode,
	$isListItemNode,
	$isListNode,
	type ListItemNode,
	type ListNode,
} from '@lexical/list'
import { calculateZoomLevel } from '@lexical/utils'
import {
	$getNearestNodeFromDOMNode,
	$getNodeByKey,
	$getRoot,
	type LexicalEditor,
	type LexicalNode,
} from 'lexical'
import { Point } from './point'
import { Rectangle } from './rect'

export const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block'

const Downward = 1
const Upward = -1
const Indeterminate = 0

let prevIndex = Infinity

export function $isCheckListItem(
	node: LexicalNode | null | undefined,
): node is ListItemNode {
	if (!$isListItemNode(node)) return false
	const parent = node.getParent()
	return $isListNode(parent) && parent.getListType() === 'check'
}

export function $isCheckListNode(
	node: LexicalNode | null | undefined,
): node is ListNode {
	return $isListNode(node) && node.getListType() === 'check'
}

function getCurrentIndex(keysLength: number): number {
	if (keysLength === 0) return Infinity
	if (prevIndex >= 0 && prevIndex < keysLength) return prevIndex
	return Math.floor(keysLength / 2)
}

function getCollapsedMargins(elem: HTMLElement): {
	marginTop: number
	marginBottom: number
} {
	const getMargin = (
		element: Element | null,
		margin: 'marginTop' | 'marginBottom',
	): number =>
		element ? parseFloat(window.getComputedStyle(element)[margin]) : 0

	const { marginTop, marginBottom } = window.getComputedStyle(elem)
	const collapsedTopMargin = Math.max(
		parseFloat(marginTop),
		getMargin(elem.previousElementSibling, 'marginBottom'),
	)
	const collapsedBottomMargin = Math.max(
		parseFloat(marginBottom),
		getMargin(elem.nextElementSibling, 'marginTop'),
	)

	return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin }
}

function isCheckListElement(elem: HTMLElement): boolean {
	const node = $getNearestNodeFromDOMNode(elem)
	return $isCheckListNode(node)
}

function getNestedCheckListItem(
	elem: HTMLElement,
	point: Point,
	anchorElementRect: DOMRect,
): HTMLElement | null {
	if (elem.tagName !== 'UL' && elem.tagName !== 'OL') return null
	if (!isCheckListElement(elem)) return null

	for (const child of Array.from(elem.children)) {
		if (!(child instanceof HTMLElement)) continue

		const domRect = Rectangle.fromDOM(child)
		const { marginTop, marginBottom } = getCollapsedMargins(child)
		const childRect = domRect.generateNewRect({
			bottom: domRect.bottom + marginBottom,
			left: anchorElementRect.left,
			right: anchorElementRect.right,
			top: domRect.top - marginTop,
		})

		if (!childRect.contains(point).result) continue

		for (const nestedChild of Array.from(child.children)) {
			if (
				nestedChild instanceof HTMLElement &&
				(nestedChild.tagName === 'UL' || nestedChild.tagName === 'OL')
			) {
				const deeplyNested = getNestedCheckListItem(
					nestedChild,
					point,
					anchorElementRect,
				)
				if (deeplyNested !== null) return deeplyNested
			}
		}

		return child
	}

	return null
}

/**
 * Must run inside editor.read() or editor.update().
 */
export function $getWikiBlockElement(
	anchorElem: HTMLElement,
	editor: LexicalEditor,
	event: MouseEvent,
	draggedNodeKey: string | null = null,
	useEdgeAsDefault = false,
): HTMLElement | null {
	const anchorElementRect = anchorElem.getBoundingClientRect()
	const topLevelNodeKeys = $getRoot().getChildrenKeys()
	const draggingCheckListItem = draggedNodeKey
		? $isCheckListItem($getNodeByKey(draggedNodeKey))
		: false

	let blockElem: HTMLElement | null = null

	if (useEdgeAsDefault) {
		const firstNode = editor.getElementByKey(topLevelNodeKeys[0])
		const lastNode = editor.getElementByKey(
			topLevelNodeKeys[topLevelNodeKeys.length - 1],
		)

		if (firstNode && lastNode) {
			const firstNodeRect = firstNode.getBoundingClientRect()
			const lastNodeRect = lastNode.getBoundingClientRect()
			const firstNodeZoom = calculateZoomLevel(firstNode)
			const lastNodeZoom = calculateZoomLevel(lastNode)

			if (event.y / firstNodeZoom < firstNodeRect.top) {
				return firstNode
			}
			if (event.y / lastNodeZoom > lastNodeRect.bottom) {
				return lastNode
			}
		}
	}

	let index = getCurrentIndex(topLevelNodeKeys.length)
	let direction = Indeterminate

	while (index >= 0 && index < topLevelNodeKeys.length) {
		const key = topLevelNodeKeys[index]
		const elem = editor.getElementByKey(key)
		if (elem === null) break

		const zoom = calculateZoomLevel(elem)
		const point = new Point(event.x / zoom, event.y / zoom)
		const domRect = Rectangle.fromDOM(elem)
		const { marginTop, marginBottom } = getCollapsedMargins(elem)
		const rect = domRect.generateNewRect({
			bottom: domRect.bottom + marginBottom,
			left: anchorElementRect.left,
			right: anchorElementRect.right,
			top: domRect.top - marginTop,
		})

		const {
			result,
			reason: { isOnTopSide, isOnBottomSide },
		} = rect.contains(point)

		if (result) {
			const node = $getNearestNodeFromDOMNode(elem)

			if ($isCheckListNode(node)) {
				if (draggedNodeKey === null || draggingCheckListItem) {
					blockElem = getNestedCheckListItem(
						elem,
						point,
						anchorElementRect,
					)
				} else {
					blockElem = elem
				}
			} else {
				blockElem = elem
			}

			prevIndex = index
			break
		}

		if (direction === Indeterminate) {
			if (isOnTopSide) direction = Upward
			else if (isOnBottomSide) direction = Downward
			else direction = Infinity
		}

		index += direction
	}

	return blockElem
}

export function getWikiBlockElement(
	anchorElem: HTMLElement,
	editor: LexicalEditor,
	event: MouseEvent,
	draggedNodeKey: string | null = null,
	useEdgeAsDefault = false,
): HTMLElement | null {
	let blockElem: HTMLElement | null = null
	editor.read(() => {
		blockElem = $getWikiBlockElement(
			anchorElem,
			editor,
			event,
			draggedNodeKey,
			useEdgeAsDefault,
		)
	})
	return blockElem
}

export function $cleanupEmptyCheckList(listNode: LexicalNode | null | undefined) {
	if ($isCheckListNode(listNode) && listNode.getChildrenSize() === 0) {
		listNode.remove()
	}
}

export function $insertDraggedCheckListNode(
	draggedNode: LexicalNode,
	targetNode: LexicalNode,
	isInsertAfter: boolean,
) {
	const sourceList = $isCheckListItem(draggedNode)
		? draggedNode.getParent()
		: null

	let insertTarget = targetNode
	let nodeToInsert = draggedNode

	if (!$isCheckListItem(draggedNode)) {
		if ($isCheckListItem(targetNode)) {
			insertTarget = targetNode.getParentOrThrow()
		}
	} else if (!$isCheckListItem(targetNode)) {
		const newList = $createListNode('check')
		newList.append(draggedNode)
		nodeToInsert = newList
	}

	if (isInsertAfter) {
		insertTarget.insertAfter(nodeToInsert)
	} else {
		insertTarget.insertBefore(nodeToInsert)
	}

	$cleanupEmptyCheckList(sourceList)
}

export function getCollapsedMarginsForElement(elem: HTMLElement) {
	return getCollapsedMargins(elem)
}
