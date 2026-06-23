import React from 'react'
import { SelectionIndicator } from 'react-aria-components'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'components/gsuite-components'

import { FulcrumFaq } from './fulcrum-faq'
import { EditorShortcuts } from './editor-shortcuts'
import { MarkdownCompletions } from './markdown-completions'
import { GlobalShortcuts } from './global-shortcuts'

const helpTabClassName =
	'relative flex w-full cursor-pointer flex-col items-stretch py-0 text-left text-fg-muted outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent/35 data-focus-visible:ring-offset-2 data-selected:font-medium data-selected:text-tab-selected'

export { HelpDialogContent }
export default function HelpDialogContent({ setIsOpen, isOpen }) {
	return (
		<Tabs orientation="vertical" className="flex min-h-0 w-full gap-0">
			<TabList
				aria-label="Help"
				className="flex w-48 shrink-0 flex-col border-r border-border"
			>
				<Tab id="faq" className={helpTabClassName}>
					<span className="block px-3 py-3 text-sm">Fulcrum FAQ</span>
					<SelectionIndicator className="bg-tab-selected absolute bottom-0 right-0 top-0 w-[3px]" />
				</Tab>
				<Tab id="shortcuts" className={helpTabClassName}>
					<span className="block px-3 py-3 text-sm">Shortcuts</span>
					<SelectionIndicator className="bg-tab-selected absolute bottom-0 right-0 top-0 w-[3px]" />
				</Tab>
				<Tab id="editor-shortcuts" className={helpTabClassName}>
					<span className="block px-3 py-3 text-sm">Editor Shortcuts</span>
					<SelectionIndicator className="bg-tab-selected absolute bottom-0 right-0 top-0 w-[3px]" />
				</Tab>
				<Tab id="editor-completions" className={helpTabClassName}>
					<span className="block px-3 py-3 text-sm">Editor Completions</span>
					<SelectionIndicator className="bg-tab-selected absolute bottom-0 right-0 top-0 w-[3px]" />
				</Tab>
			</TabList>

			<TabPanels className="min-h-0 min-w-0 flex-1 overflow-y-auto pl-6 prose prose-stone">
				<TabPanel id="faq">
					<FulcrumFaq />
				</TabPanel>
				<TabPanel id="shortcuts">
					<GlobalShortcuts />
				</TabPanel>
				<TabPanel id="editor-shortcuts">
					<EditorShortcuts />
				</TabPanel>
				<TabPanel id="editor-completions">
					<MarkdownCompletions />
				</TabPanel>
			</TabPanels>
		</Tabs>
	)
}
