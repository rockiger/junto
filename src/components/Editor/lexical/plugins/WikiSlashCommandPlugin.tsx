import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch,
	type MenuRenderFn,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import clsx from 'clsx'
import type { TextNode } from 'lexical'
import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ImageUrlModalHandle } from '../image-url-modal'
import { ImageUrlModal } from '../image-url-modal'
import './DraggableBlockPlugin.css'
import {
	filterWikiComponentPickerOptions,
	getWikiBaseOptions,
	getWikiDynamicOptions,
	type WikiComponentPickerOption,
} from './wikiComponentPickerOptions'

class WikiSlashMenuOption extends MenuOption {
	keywords: string[]
	onSelect: (queryString: string) => void

	constructor(option: WikiComponentPickerOption) {
		super(option.key)
		this.title = option.title
		this.keywords = option.keywords
		this.icon = option.icon as MenuOption['icon']
		this.onSelect = option.onSelect
	}
}

export default function WikiSlashCommandPlugin() {
	const [editor] = useLexicalComposerContext()
	const imageUrlModalRef = useRef<ImageUrlModalHandle>(null)
	const [queryString, setQueryString] = useState<string | null>(null)

	const checkForSlashMatch = useBasicTypeaheadTriggerMatch('/', {
		allowWhitespace: true,
		minLength: 0,
	})

	const onInsertImage = useCallback(async () => {
		try {
			return await imageUrlModalRef.current?.show()
		} catch {
			return undefined
		}
	}, [])

	const options = useMemo(() => {
		const baseOptions = getWikiBaseOptions(editor, onInsertImage).map(
			(option) => new WikiSlashMenuOption(option),
		)

		if (!queryString) return baseOptions

		return [
			...getWikiDynamicOptions(editor, queryString).map(
				(option) => new WikiSlashMenuOption(option),
			),
			...filterWikiComponentPickerOptions(
				getWikiBaseOptions(editor, onInsertImage),
				queryString,
			).map((option) => new WikiSlashMenuOption(option)),
		]
	}, [editor, onInsertImage, queryString])

	const onSelectOption = useCallback(
		(
			selectedOption: WikiSlashMenuOption,
			nodeToRemove: TextNode | null,
			closeMenu: () => void,
			matchingString: string,
		) => {
			editor.update(() => {
				nodeToRemove?.remove()
				selectedOption.onSelect(matchingString)
				closeMenu()
			})
		},
		[editor],
	)

	const menuRenderFn: MenuRenderFn<WikiSlashMenuOption> = useCallback(
		(
			anchorElementRef,
			{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options },
		) => {
			if (anchorElementRef.current == null || !options.length) {
				return null
			}

			return createPortal(
				<div className="draggable-block-component-picker">
					<ul className="draggable-block-component-picker-list">
						{options.map((option, index) => (
							<li key={option.key}>
								<button
									ref={option.setRefElement}
									type="button"
									className={clsx(
										'draggable-block-component-picker-item',
										selectedIndex === index &&
											'draggable-block-component-picker-item--selected',
									)}
									onClick={() => selectOptionAndCleanUp(option)}
									onMouseEnter={() => setHighlightedIndex(index)}
								>
									{option.icon}
									<span>{option.title}</span>
								</button>
							</li>
						))}
					</ul>
				</div>,
				anchorElementRef.current,
			)
		},
		[],
	)

	return (
		<>
			<ImageUrlModal ref={imageUrlModalRef} />
			<LexicalTypeaheadMenuPlugin
				menuRenderFn={menuRenderFn}
				options={options}
				triggerFn={checkForSlashMatch}
				onQueryChange={setQueryString}
				onSelectOption={onSelectOption}
			/>
		</>
	)
}
