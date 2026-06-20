import { $createCodeNode } from '@lexical/code'
import {
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import {
	$createHeadingNode,
	$createQuoteNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	type ElementNode,
	type LexicalEditor,
} from 'lexical'
import type { ReactNode } from 'react'
import CodeBracesIcon from 'mdi-react/CodeBracesIcon'
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'
import FormatHeader3Icon from 'mdi-react/FormatHeader3Icon'
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon'
import FormatListChecksIcon from 'mdi-react/FormatListChecksIcon'
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon'
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon'
import FormatTextIcon from 'mdi-react/FormatTextIcon'
import ImageIcon from 'mdi-react/ImageIcon'
import TableLargeIcon from 'mdi-react/TableLargeIcon'
import ViewColumnIcon from 'mdi-react/ViewColumnIcon'
import { LAYOUT_PRESETS } from '../layoutPresets'
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin'
import { INSERT_LAYOUT_COMMAND } from './LayoutPlugin'

const ICON_CLASS = 'size-5 shrink-0'

export type WikiComponentPickerOption = {
	key: string
	title: string
	keywords: string[]
	icon?: ReactNode
	onSelect: (queryString: string) => void
}

export function getWikiDynamicOptions(
	editor: LexicalEditor,
	queryString: string,
): WikiComponentPickerOption[] {
	const options: WikiComponentPickerOption[] = []
	const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/)

	if (tableMatch !== null) {
		const rows = tableMatch[1]
		const colOptions = tableMatch[2]
			? [tableMatch[2]]
			: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

		for (const columns of colOptions) {
			options.push({
				key: `table-${rows}x${columns}`,
				title: `${rows}x${columns} Table`,
				keywords: ['table'],
				icon: <TableLargeIcon className={ICON_CLASS} />,
				onSelect: () => {
					editor.dispatchCommand(INSERT_TABLE_COMMAND, {
						columns,
						rows,
						includeHeaders: { columns: false, rows: true },
					})
				},
			})
		}
	}

	return options
}

export function getWikiBaseOptions(
	editor: LexicalEditor,
	onInsertImage: () => Promise<string | undefined>,
): WikiComponentPickerOption[] {
	const setBlockType = (createNode: () => ElementNode) => {
		editor.update(() => {
			const selection = $getSelection()
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, createNode)
			}
		})
	}

	return [
		{
			key: 'paragraph',
			title: 'Paragraph',
			keywords: ['normal', 'paragraph', 'p', 'text'],
			icon: <FormatTextIcon className={ICON_CLASS} />,
			onSelect: () => setBlockType($createParagraphNode),
		},
		{
			key: 'heading-2',
			title: 'Heading 2',
			keywords: ['heading', 'header', 'h2'],
			icon: <FormatHeader2Icon className={ICON_CLASS} />,
			onSelect: () => setBlockType(() => $createHeadingNode('h2')),
		},
		{
			key: 'heading-3',
			title: 'Heading 3',
			keywords: ['heading', 'header', 'h3'],
			icon: <FormatHeader3Icon className={ICON_CLASS} />,
			onSelect: () => setBlockType(() => $createHeadingNode('h3')),
		},
		{
			key: 'table',
			title: 'Table',
			keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
			icon: <TableLargeIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.dispatchCommand(INSERT_TABLE_COMMAND, {
					columns: '3',
					rows: '3',
					includeHeaders: { columns: false, rows: true },
				})
			},
		},
		{
			key: 'numbered-list',
			title: 'Numbered List',
			keywords: ['numbered list', 'ordered list', 'ol'],
			icon: <FormatListNumberedIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
			},
		},
		{
			key: 'bulleted-list',
			title: 'Bulleted List',
			keywords: ['bulleted list', 'unordered list', 'ul'],
			icon: <FormatListBulletedIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
			},
		},
		{
			key: 'check-list',
			title: 'Check List',
			keywords: ['check list', 'todo list'],
			icon: <FormatListChecksIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
			},
		},
		{
			key: 'quote',
			title: 'Quote',
			keywords: ['block quote'],
			icon: <FormatQuoteCloseIcon className={ICON_CLASS} />,
			onSelect: () => setBlockType($createQuoteNode),
		},
		{
			key: 'code',
			title: 'Code',
			keywords: ['javascript', 'python', 'js', 'codeblock'],
			icon: <CodeBracesIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.update(() => {
					const selection = $getSelection()
					if (!$isRangeSelection(selection)) return
					if (selection.isCollapsed()) {
						$setBlocksType(selection, () => $createCodeNode())
					} else {
						const textContent = selection.getTextContent()
						const codeNode = $createCodeNode()
						selection.insertNodes([codeNode])
						selection.insertRawText(textContent)
					}
				})
			},
		},
		{
			key: 'image',
			title: 'Image',
			keywords: ['image', 'photo', 'picture', 'file'],
			icon: <ImageIcon className={ICON_CLASS} />,
			onSelect: () => {
				void onInsertImage().then((src) => {
					if (src) {
						editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src })
					}
				})
			},
		},
		...LAYOUT_PRESETS.map(({ label, template }) => ({
			key: `layout-${template}`,
			title: label,
			keywords: ['columns', 'layout', 'grid'],
			icon: <ViewColumnIcon className={ICON_CLASS} />,
			onSelect: () => {
				editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template)
			},
		})),
	]
}

export function filterWikiComponentPickerOptions(
	options: WikiComponentPickerOption[],
	queryString: string,
): WikiComponentPickerOption[] {
	if (!queryString) return options
	const regex = new RegExp(queryString, 'i')
	return options.filter(
		(option) =>
			regex.test(option.title) ||
			option.keywords.some((keyword) => regex.test(keyword)),
	)
}
