import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createListItemNode } from '@lexical/list'
import clsx from 'clsx'
import {
	$createParagraphNode,
	$createTextNode,
	$getNearestNodeFromDOMNode,
	$getNodeByKey,
	$isParagraphNode,
	$isTextNode,
	type NodeKey,
} from 'lexical'
import DragVerticalIcon from 'mdi-react/DragVerticalIcon'
import PlusIcon from 'mdi-react/PlusIcon'
import {
	type MouseEvent as ReactMouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { createPortal } from 'react-dom'
import type { ImageUrlModalHandle } from '../image-url-modal'
import { ImageUrlModal } from '../image-url-modal'
import { $isCheckListItem } from './draggableBlock/checkListDragUtils'
import { WikiDraggableBlockPlugin } from './draggableBlock/WikiDraggableBlockPlugin'
import './DraggableBlockPlugin.css'
import {
	filterWikiComponentPickerOptions,
	getWikiBaseOptions,
	getWikiDynamicOptions,
	type WikiComponentPickerOption,
} from './wikiComponentPickerOptions'

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu'

type PickerState = {
	insertBefore: boolean
	targetNodeKey: NodeKey
}

function isOnMenu(element: HTMLElement): boolean {
	return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`)
}

export interface DraggableBlockPluginProps {
	anchorElem: HTMLElement
}

export default function DraggableBlockPlugin({
	anchorElem,
}: DraggableBlockPluginProps) {
	const [editor] = useLexicalComposerContext()
	const menuRef = useRef<HTMLDivElement>(null)
	const targetLineRef = useRef<HTMLDivElement>(null)
	const pickerRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const imageUrlModalRef = useRef<ImageUrlModalHandle>(null)
	const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(
		null,
	)
	const [pickerState, setPickerState] = useState<PickerState | null>(null)
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [queryString, setQueryString] = useState('')
	const [highlightedIndex, setHighlightedIndex] = useState(0)
	const [pickerPosition, setPickerPosition] = useState<{
		left: number
		top: number
	} | null>(null)

	const onInsertImage = useCallback(async () => {
		try {
			return await imageUrlModalRef.current?.show()
		} catch {
			return undefined
		}
	}, [])

	const options = useMemo(() => {
		const baseOptions = getWikiBaseOptions(editor, onInsertImage)
		if (!queryString) return baseOptions

		return [
			...getWikiDynamicOptions(editor, queryString),
			...filterWikiComponentPickerOptions(baseOptions, queryString),
		]
	}, [editor, onInsertImage, queryString])

	useEffect(() => {
		if (isPickerOpen) {
			searchInputRef.current?.focus()
		}
	}, [isPickerOpen])

	useEffect(() => {
		if (!isPickerOpen || !options.length) return
		setHighlightedIndex((current) =>
			Math.min(current, Math.max(options.length - 1, 0)),
		)
	}, [isPickerOpen, options.length])

	useEffect(() => {
		if (!isPickerOpen) return

		const handleClickOutside = (event: globalThis.MouseEvent) => {
			const target = event.target as Node | null
			if (
				pickerRef.current?.contains(target) ||
				menuRef.current?.contains(target)
			) {
				return
			}
			setIsPickerOpen(false)
			setPickerState(null)
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isPickerOpen])

	const selectOption = useCallback(
		(option: WikiComponentPickerOption) => {
			if (!pickerState) {
				setIsPickerOpen(false)
				return
			}

			setIsPickerOpen(false)
			const isImageOption = option.key === 'image'

			editor.update(() => {
				const node = $getNodeByKey(pickerState.targetNodeKey)
				if (!node) return

				if ($isCheckListItem(node)) {
					const newItem = $createListItemNode()
					const paragraph = $createParagraphNode()
					paragraph.append($createTextNode(''))
					newItem.append(paragraph)

					if (pickerState.insertBefore) {
						node.insertBefore(newItem)
					} else {
						node.insertAfter(newItem)
					}

					paragraph.select()
					option.onSelect(queryString)
					return
				}

				const placeholder = $createParagraphNode()
				const textNode = $createTextNode('')
				placeholder.append(textNode)

				if (pickerState.insertBefore) {
					node.insertBefore(placeholder)
				} else {
					node.insertAfter(placeholder)
				}

				textNode.select()
				option.onSelect(queryString)

				if (!isImageOption) {
					const latestPlaceholder = placeholder.getLatest()
					if ($isParagraphNode(latestPlaceholder)) {
						const onlyChild = latestPlaceholder.getFirstChild()
						if (
							$isTextNode(onlyChild) &&
							onlyChild.getTextContent().length === 0 &&
							latestPlaceholder.getChildrenSize() === 1
						) {
							latestPlaceholder.remove()
						}
					}
				}
			})
		},
		[editor, pickerState, queryString],
	)

	useEffect(() => {
		if (!isPickerOpen || !options.length) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault()
				setHighlightedIndex((index) =>
					index + 1 >= options.length ? 0 : index + 1,
				)
			} else if (event.key === 'ArrowUp') {
				event.preventDefault()
				setHighlightedIndex((index) =>
					index - 1 < 0 ? options.length - 1 : index - 1,
				)
			} else if (event.key === 'Enter') {
				event.preventDefault()
				const option = options[highlightedIndex]
				if (option) selectOption(option)
			} else if (event.key === 'Escape') {
				event.preventDefault()
				setIsPickerOpen(false)
				setPickerState(null)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [highlightedIndex, isPickerOpen, options, selectOption])

	const openComponentPicker = (event: ReactMouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()
		if (!draggableElement) return

		let targetNodeKey: NodeKey | null = null
		editor.read(() => {
			const resolvedNode = $getNearestNodeFromDOMNode(draggableElement)
			if (resolvedNode) {
				targetNodeKey = resolvedNode.getKey()
			}
		})

		if (!targetNodeKey) return

		const insertBefore = event.altKey || event.ctrlKey
		const rect = menuRef.current?.getBoundingClientRect()
		setPickerPosition(
			rect
				? {
						left: rect.left + rect.width + window.scrollX + 8,
						top: rect.top + window.scrollY,
					}
				: null,
		)
		setPickerState({ insertBefore, targetNodeKey })
		setQueryString('')
		setHighlightedIndex(0)
		setIsPickerOpen(true)
	}

	return (
		<>
			<ImageUrlModal ref={imageUrlModalRef} />
			{isPickerOpen && pickerPosition
				? createPortal(
						<div
							ref={pickerRef}
							className="draggable-block-component-picker"
							style={{
								left: pickerPosition.left,
								position: 'absolute',
								top: pickerPosition.top,
								zIndex: 1000,
							}}
						>
							<input
								ref={searchInputRef}
								className="draggable-block-component-picker-search"
								placeholder="Filter blocks..."
								value={queryString}
								onChange={(event) => setQueryString(event.target.value)}
							/>
							<ul className="draggable-block-component-picker-list">
								{options.map((option, index) => (
									<li key={option.key}>
										<button
											type="button"
											className={clsx(
												'draggable-block-component-picker-item',
												highlightedIndex === index &&
													'draggable-block-component-picker-item--selected',
											)}
											onClick={() => {
												setHighlightedIndex(index)
												selectOption(option)
											}}
											onMouseEnter={() => setHighlightedIndex(index)}
										>
											{option.icon}
											<span>{option.title}</span>
										</button>
									</li>
								))}
							</ul>
						</div>,
						document.body,
					)
				: null}
			<WikiDraggableBlockPlugin
				anchorElem={anchorElem}
				isOnMenu={isOnMenu}
				menuComponent={
					<div ref={menuRef} className={DRAGGABLE_BLOCK_MENU_CLASSNAME}>
						<button
							type="button"
							className="draggable-block-add"
							title="Click to add below (Ctrl+click to add above)"
							onClick={openComponentPicker}
						>
							<PlusIcon aria-hidden className="size-4 text-fg-muted opacity-60" />
						</button>
						<DragVerticalIcon
							aria-hidden
							className="size-4 text-fg-muted opacity-60"
						/>
					</div>
				}
				menuRef={menuRef}
				onElementChanged={setDraggableElement}
				targetLineComponent={
					<div
						ref={targetLineRef}
						className="draggable-block-target-line"
					/>
				}
				targetLineRef={targetLineRef}
			/>
		</>
	)
}
