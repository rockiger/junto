import { $createCodeNode, $isCodeNode } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
	$isListNode,
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	ListNode,
	REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	$createHeadingNode,
	$createQuoteNode,
	$isHeadingNode,
	$isQuoteNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
	$deleteTableColumnAtSelection,
	$deleteTableRowAtSelection,
	$getTableNodeFromLexicalNodeOrThrow,
	$insertTableColumnAtSelection,
	$insertTableRowAtSelection,
	$isTableCellNode,
	$isTableRowNode,
	INSERT_TABLE_COMMAND,
	TableCellHeaderStates,
	type TableCellNode,
} from '@lexical/table'
import {
	$findMatchingParent,
	$getNearestNodeOfType,
	mergeRegister,
} from '@lexical/utils'
import clsx from 'clsx'
import { Tooltip } from 'components/gsuite-components/tooltip'
import { getParentFolderId } from 'components/Sidebar/Sidebar-helper'
import {
	$createParagraphNode,
	$createTextNode,
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_CRITICAL,
	type ElementNode,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND,
	type TextFormatType,
} from 'lexical'
import { driveImageSrc, uploadBinaryFile } from 'lib/gdrive'
import DrawIcon from 'mdi-react/DrawIcon'
import CodeTagsIcon from 'mdi-react/CodeTagsIcon'
import FormatBoldIcon from 'mdi-react/FormatBoldIcon'
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'
import FormatHeader3Icon from 'mdi-react/FormatHeader3Icon'
import FormatItalicIcon from 'mdi-react/FormatItalicIcon'
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon'
import FormatListChecksIcon from 'mdi-react/FormatListChecksIcon'
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon'
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon'
import FormatStrikethroughIcon from 'mdi-react/FormatStrikethroughVariantIcon'
import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import GoogleDriveIcon from 'mdi-react/GoogleDriveIcon'
import ImageIcon from 'mdi-react/ImageIcon'
import LinkIcon from 'mdi-react/LinkIcon'
import LinkVariantIcon from 'mdi-react/LinkVariantIcon'
import PageLayoutHeaderIcon from 'mdi-react/PageLayoutHeaderIcon'
import TableColumnPlusAfterIcon from 'mdi-react/TableColumnPlusAfterIcon'
import TableColumnRemoveIcon from 'mdi-react/TableColumnRemoveIcon'
import TableLargeIcon from 'mdi-react/TableLargeIcon'
import TableLargeRemoveIcon from 'mdi-react/TableLargeRemoveIcon'
import TableRowPlusAfterIcon from 'mdi-react/TableRowPlusAfterIcon'
import TableRowRemoveIcon from 'mdi-react/TableRowRemoveIcon'
import UploadIcon from 'mdi-react/UploadIcon'
import ViewColumnIcon from 'mdi-react/ViewColumnIcon'
import {
	type ComponentProps,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	Menu,
	MenuItem,
	MenuTrigger,
	Popover,
	ToggleButton,
	type ToggleButtonRenderProps,
} from 'react-aria-components'
import { useGlobal } from 'reactn'
import type { IFile } from 'reactn/default'
import type { DriveImagePickerModalHandle } from '../drive-image-picker-modal'
import { DriveImagePickerModal } from '../drive-image-picker-modal'
import { getDocument } from '../gpicker'
import type { ImageUrlModalHandle } from '../image-url-modal'
import { ImageUrlModal } from '../image-url-modal'
import type { LinkItem, LinkModalHandle } from '../link-modal'
import { LinkModal } from '../link-modal'
import { $createWikiLinkNode } from '../nodes/WikiLinkNode'
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin'
import { INSERT_EXCALIDRAW_COMMAND } from './ExcalidrawPlugin'
import { INSERT_LAYOUT_COMMAND } from './LayoutPlugin'
import { LAYOUT_PRESETS } from '../layoutPresets'

const ICON_CLASS = 'size-[18px]'
const MENU_ICON_CLASS = 'size-5 shrink-0'

const toolbarToggleClass = ({
	isSelected,
	isPressed,
}: ToggleButtonRenderProps) =>
	clsx(
		'flex size-6 items-center justify-center rounded-sm outline-none transition-colors',
		'focus-visible:ring-2 focus-visible:ring-accent',
		isSelected
			? 'bg-icon-blue-lighter text-accent'
			: 'text-fg-muted hover:bg-surface-alt hover:text-fg-default',
		isPressed && !isSelected && 'bg-surface-hover',
	)

const menuItemClass =
	'flex cursor-default items-center gap-2 px-3 py-2 text-sm text-fg-default outline-none hover:bg-surface-hover focus:bg-surface-hover'

function EditorToolbar({ children, readOnly }: { children: ReactNode, readOnly: boolean }) {
	return (
		<div className="bg-white border-b border-edge-strong sticky top-0 z-10 lg:top-14">
			{!readOnly && <div className="bg-surface-container flex max-w-100vw mb-4 mx-4 overflow-auto p-2 pl-5 rounded-full">
				{children}
			</div>}
		</div>
	)
}

function ToolbarGroup({ children }: { children: ReactNode }) {
	return <div className="mr-4 flex items-center gap-0.5">{children}</div>
}

type ToolbarButtonProps = Omit<
	ComponentProps<typeof ToggleButton>,
	'children' | 'className' | 'isSelected'
> & {
	active?: boolean
	children: ReactNode
	title: string
}

function ToolbarButton({ active, title, children, ...props }: ToolbarButtonProps) {
	return (
		<Tooltip content={title}>
			<ToggleButton
				{...props}
				aria-label={title}
				className={toolbarToggleClass}
				isSelected={active}
			>
				{children}
			</ToggleButton>
		</Tooltip>
	)
}

function cellHasRowHeader(cell: TableCellNode): boolean {
	return (
		(cell as TableCellNode & { __headerState: number }).__headerState ===
		TableCellHeaderStates.ROW
	)
}

export interface ToolbarPluginProps {
	apiKey: string
	fileId?: string
	items: LinkItem[]
	readOnly: boolean
}

export default function ToolbarPlugin({
	apiKey,
	fileId,
	items,
	readOnly,
}: ToolbarPluginProps) {
	const [editor] = useLexicalComposerContext()
	const [files, setFiles] = useGlobal('files')
	const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
	const modalRef = useRef<LinkModalHandle>(null)
	const imageUrlModalRef = useRef<ImageUrlModalHandle>(null)
	const driveImagePickerRef = useRef<DriveImagePickerModalHandle>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const [blockType, setBlockType] = useState('paragraph')
	const [formats, setFormats] = useState<Record<string, boolean>>({})
	const [isLink, setIsLink] = useState(false)
	const [isInTable, setIsInTable] = useState(false)

	const updateToolbar = useCallback(() => {
		const selection = $getSelection()
		if (!$isRangeSelection(selection)) return

		setFormats({
			bold: selection.hasFormat('bold'),
			code: selection.hasFormat('code'),
			italic: selection.hasFormat('italic'),
			strikethrough: selection.hasFormat('strikethrough'),
			underline: selection.hasFormat('underline'),
		})

		const anchorNode = selection.anchor.getNode()
		const element =
			anchorNode.getKey() === 'root'
				? anchorNode
				: $findMatchingParent(anchorNode, (node) => {
					const parent = node.getParent()
					return parent !== null && $isRootOrShadowRoot(parent)
				})

		let nextBlockType = 'paragraph'
		if ($isListNode(element)) {
			const parentList = $getNearestNodeOfType(anchorNode, ListNode)
			nextBlockType = parentList
				? parentList.getListType()
				: element.getListType()
		} else if ($isHeadingNode(element)) {
			nextBlockType = element.getTag()
		} else if ($isQuoteNode(element)) {
			nextBlockType = 'quote'
		} else if ($isCodeNode(element)) {
			nextBlockType = 'code'
		}
		setBlockType(nextBlockType)

		setIsLink($findMatchingParent(anchorNode, $isLinkNode) != null)
		setIsInTable($findMatchingParent(anchorNode, $isTableCellNode) != null)
	}, [])

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(updateToolbar)
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateToolbar()
					return false
				},
				COMMAND_PRIORITY_CRITICAL,
			),
		)
	}, [editor, updateToolbar])

	const formatText = (format: TextFormatType) => (event: MouseEvent) => {
		event.preventDefault()
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
	}

	const toggleBlock =
		(type: string, createNode: () => ElementNode) => (event: MouseEvent) => {
			event.preventDefault()
			editor.update(() => {
				const selection = $getSelection()
				if (!$isRangeSelection(selection)) return
				$setBlocksType(selection, () =>
					blockType === type ? $createParagraphNode() : createNode(),
				)
			})
		}

	const toggleList =
		(type: string, command: typeof INSERT_UNORDERED_LIST_COMMAND) =>
			(event: MouseEvent) => {
				event.preventDefault()
				if (blockType === type) {
					editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
				} else {
					editor.dispatchCommand(command, undefined)
				}
			}

	const onClickLink = async (event: MouseEvent) => {
		event.preventDefault()
		let text = ''
		let href = ''
		editor.getEditorState().read(() => {
			const selection = $getSelection()
			if (!$isRangeSelection(selection)) return
			text = selection.getTextContent()
			const linkParent = $findMatchingParent(
				selection.anchor.getNode(),
				$isLinkNode,
			)
			if (linkParent) {
				href = linkParent.getURL()
				text = linkParent.getTextContent()
			}
		})
		try {
			const result = await modalRef.current?.show(text, href)
			if (result?.href) applyLink(result)
		} catch {
			// modal canceled
		}
		editor.focus()
	}

	function applyLink({ href, text }: { href: string; text: string }) {
		let needsToggle = false
		editor.update(() => {
			const selection = $getSelection()
			if (!$isRangeSelection(selection)) return
			const linkParent = $findMatchingParent(
				selection.anchor.getNode(),
				$isLinkNode,
			)
			if (linkParent) {
				linkParent.setURL(href)
				if (text && text !== linkParent.getTextContent()) {
					linkParent.clear()
					linkParent.append($createTextNode(text))
				}
			} else if (selection.isCollapsed()) {
				const link = $createWikiLinkNode(href)
				link.append($createTextNode(text || href))
				selection.insertNodes([link])
			} else {
				needsToggle = true
			}
		})
		if (needsToggle) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, href)
		}
	}

	const onImageMenuUpload = () => {
		imageInputRef.current?.click()
	}

	const onImageMenuByUrl = async () => {
		try {
			const src = await imageUrlModalRef.current?.show()
			if (src) editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src })
		} catch {
			// dialog cancelled
		}
		editor.focus()
	}

	const onImageMenuGoogleDrive = async () => {
		try {
			const picked = await driveImagePickerRef.current?.show()
			if (picked) {
				editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
					src: driveImageSrc(picked.id),
					altText: picked.name,
				})
			}
		} catch {
			// dialog cancelled or load failed
		}
		editor.focus()
	}

	const onImageFileSelected = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file?.type?.startsWith('image/')) return
		if (!fileId) {
			console.error('No page id for image upload')
			return
		}

		try {
			const parentId = getParentFolderId(fileId, initialFiles ?? [])
			const uploaded = (await uploadBinaryFile({ file, parentId })) as IFile
			const currentFiles = (files ?? []) as IFile[]
			const currentInitialFiles = (initialFiles ?? []) as IFile[]
			setFiles([...currentFiles, uploaded])
			setInitialFiles([...currentInitialFiles, uploaded])
			editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
				src: driveImageSrc(uploaded.id),
				altText: uploaded.name || file.name,
			})
		} catch (err) {
			console.error('Image upload failed', err)
			alert('Could not upload image. Please try again.')
		}
		editor.focus()
	}

	const onClickDrive = async (event: MouseEvent) => {
		event.preventDefault()
		if (!(window.gapi && window.google)) return
		try {
			const doc = await getDocument(apiKey)
			editor.update(() => {
				const selection = $getSelection()
				if (!$isRangeSelection(selection)) return
				const link = $createWikiLinkNode(doc.href)
				link.append($createTextNode(doc.name))
				selection.insertNodes([link])
			})
		} catch (err) {
			if (err instanceof Error && err.message === 'cancel') {
				console.log('Picker canceled')
			}
		}
		editor.focus()
	}

	const tableAction = (action: string) => (event: MouseEvent) => {
		event.preventDefault()
		if (action === 'insertTable') {
			editor.dispatchCommand(INSERT_TABLE_COMMAND, {
				columns: '3',
				rows: '3',
				includeHeaders: { columns: false, rows: true },
			})
			return
		}
		editor.update(() => {
			const selection = $getSelection()
			if (!$isRangeSelection(selection)) return
			const cellNode = $findMatchingParent(
				selection.anchor.getNode(),
				$isTableCellNode,
			)
			if (!cellNode) return

			switch (action) {
				case 'removeTable':
					$getTableNodeFromLexicalNodeOrThrow(cellNode).remove()
					break
				case 'insertColumn':
					$insertTableColumnAtSelection(true)
					break
				case 'removeColumn':
					$deleteTableColumnAtSelection()
					break
				case 'insertRow':
					$insertTableRowAtSelection(true)
					break
				case 'removeRow':
					$deleteTableRowAtSelection()
					break
				case 'toggleTableHeaders': {
					const table = $getTableNodeFromLexicalNodeOrThrow(cellNode)
					const firstRow = table.getFirstChild()
					if (!$isTableRowNode(firstRow)) break
					const cells = firstRow.getChildren().filter($isTableCellNode)
					const isHeader = cells.every(cellHasRowHeader)
					cells.forEach((cell) => {
						cell.setHeaderStyles(
							isHeader
								? TableCellHeaderStates.NO_STATUS
								: TableCellHeaderStates.ROW,
							TableCellHeaderStates.ROW,
						)
					})
					break
				}
				default:
			}
		})
	}

	const preventMouseDown = (event: MouseEvent) => {
		event.preventDefault()
	}

	const onInsertExcalidraw = (event: MouseEvent) => {
		event.preventDefault()
		editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
		editor.focus()
	}

	return (
		<>
			<input
				ref={imageInputRef}
				accept="image/*"
				className="hidden"
				onChange={onImageFileSelected}
				type="file"
			/>
			<EditorToolbar readOnly={readOnly}>
				<ToolbarGroup>
					<ToolbarButton
						active={blockType === 'h2'}
						onMouseDown={toggleBlock('h2', () => $createHeadingNode('h2'))}
						title="Heading 2"
					>
						<FormatHeader2Icon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={blockType === 'h3'}
						onMouseDown={toggleBlock('h3', () => $createHeadingNode('h3'))}
						title="Heading 3"
					>
						<FormatHeader3Icon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={blockType === 'quote'}
						onMouseDown={toggleBlock('quote', $createQuoteNode)}
						title="Quote"
					>
						<FormatQuoteCloseIcon className={ICON_CLASS} />
					</ToolbarButton>
				</ToolbarGroup>

				<ToolbarGroup>
					<ToolbarButton
						active={formats.bold}
						onMouseDown={formatText('bold')}
						title="Bold (Ctrl+B)"
					>
						<FormatBoldIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={formats.italic}
						onMouseDown={formatText('italic')}
						title="Italic (Ctrl+I)"
					>
						<FormatItalicIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={formats.underline}
						onMouseDown={formatText('underline')}
						title="Underline (Ctrl+U)"
					>
						<FormatUnderlineIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={formats.strikethrough}
						onMouseDown={formatText('strikethrough')}
						title="Strikethrough"
					>
						<FormatStrikethroughIcon className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						active={formats.code}
						onMouseDown={formatText('code')}
						title="Inline code"
					>
						<CodeTagsIcon className={ICON_CLASS} />
					</ToolbarButton>
				</ToolbarGroup>

				<ToolbarGroup>
					<ToolbarButton
						active={isLink}
						onMouseDown={onClickLink}
						title="Link"
					>
						<LinkIcon className={ICON_CLASS} />
					</ToolbarButton>
					<MenuTrigger>
						<Tooltip content="Image">
							<ToggleButton
								aria-label="Image"
								className={toolbarToggleClass}
								onMouseDown={preventMouseDown}
							>
								<ImageIcon className={ICON_CLASS} />
							</ToggleButton>
						</Tooltip>
						<Popover
							className="z-1000 min-w-48 rounded-md border border-edge bg-surface-paper py-1 shadow-lg outline-none"
							offset={4}
							placement="bottom start"
						>
							<Menu className="outline-none">
								<MenuItem
									className={menuItemClass}
									id="upload"
									textValue="Upload from Computer"
									onAction={onImageMenuUpload}
								>
									<UploadIcon className={MENU_ICON_CLASS} />
									Upload from Computer
								</MenuItem>
								<MenuItem
									className={menuItemClass}
									id="url"
									textValue="By URL"
									onAction={onImageMenuByUrl}
								>
									<LinkVariantIcon className={MENU_ICON_CLASS} />
									By URL
								</MenuItem>
								<MenuItem
									className={menuItemClass}
									id="drive"
									textValue="Google Drive"
									onAction={onImageMenuGoogleDrive}
								>
									<GoogleDriveIcon className={MENU_ICON_CLASS} />
									Google Drive
								</MenuItem>
							</Menu>
						</Popover>
					</MenuTrigger>
					<ToolbarButton
						onMouseDown={onInsertExcalidraw}
						title="Excalidraw drawing"
					>
						<DrawIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						onMouseDown={onClickDrive}
						title="Google Drive file"
					>
						<GoogleDriveIcon className={ICON_CLASS} />
					</ToolbarButton>
				</ToolbarGroup>

				<ToolbarGroup>
					<ToolbarButton
						active={blockType === 'bullet'}
						onMouseDown={toggleList('bullet', INSERT_UNORDERED_LIST_COMMAND)}
						title="Bulleted list"
					>
						<FormatListBulletedIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={blockType === 'number'}
						onMouseDown={toggleList('number', INSERT_ORDERED_LIST_COMMAND)}
						title="Numbered list"
					>
						<FormatListNumberedIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={blockType === 'check'}
						onMouseDown={toggleList('check', INSERT_CHECK_LIST_COMMAND)}
						title="Check list"
					>
						<FormatListChecksIcon className={ICON_CLASS} />
					</ToolbarButton>
					<ToolbarButton
						active={blockType === 'code'}
						onMouseDown={toggleBlock('code', () => $createCodeNode())}
						title="Code block"
					>
						<CodeTagsIcon className={ICON_CLASS} />
					</ToolbarButton>
				</ToolbarGroup>

				<ToolbarGroup>
					<MenuTrigger>
						<Tooltip content="Columns layout">
							<ToggleButton
								aria-label="Columns layout"
								className={toolbarToggleClass}
								onMouseDown={preventMouseDown}
							>
								<ViewColumnIcon className={ICON_CLASS} />
							</ToggleButton>
						</Tooltip>
						<Popover
							className="z-1000 min-w-56 rounded-md border border-edge bg-surface-paper py-1 shadow-lg outline-none"
							offset={4}
							placement="bottom start"
						>
							<Menu className="outline-none">
								{LAYOUT_PRESETS.map(({ label, template }) => (
									<MenuItem
										key={template}
										className={menuItemClass}
										id={template}
										textValue={label}
										onAction={() => {
											editor.dispatchCommand(
												INSERT_LAYOUT_COMMAND,
												template,
											)
											editor.focus()
										}}
									>
										{label}
									</MenuItem>
								))}
							</Menu>
						</Popover>
					</MenuTrigger>
					<ToolbarButton
						onMouseDown={tableAction('insertTable')}
						title="Insert table"
					>
						<TableLargeIcon className={ICON_CLASS} />
					</ToolbarButton>
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('removeTable')}
							title="Remove table"
						>
							<TableLargeRemoveIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('insertColumn')}
							title="Insert column"
						>
							<TableColumnPlusAfterIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('removeColumn')}
							title="Remove column"
						>
							<TableColumnRemoveIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('insertRow')}
							title="Insert row"
						>
							<TableRowPlusAfterIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('removeRow')}
							title="Remove row"
						>
							<TableRowRemoveIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
					{isInTable && (
						<ToolbarButton
							onMouseDown={tableAction('toggleTableHeaders')}
							title="Toggle header row"
						>
							<PageLayoutHeaderIcon className={ICON_CLASS} />
						</ToolbarButton>
					)}
				</ToolbarGroup>
			</EditorToolbar>
			<LinkModal ref={modalRef} items={items} />
			<ImageUrlModal ref={imageUrlModalRef} />
			<DriveImagePickerModal ref={driveImagePickerRef} />
		</>
	)
}
