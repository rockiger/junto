import React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'components/gsuite-components'

import { FulcrumFaq } from './fulcrum-faq'
import { EditorShortcuts } from './editor-shortcuts'
import { MarkdownCompletions } from './markdown-completions'
import { GlobalShortcuts } from './global-shortcuts'

export { HelpDialogContent }
export default function HelpDialogContent({ setIsOpen, isOpen }) {
    return (
        <Tabs>
            <TabList>
                <Tab>Fulcrum FAQ</Tab>
                <Tab>Shortcuts</Tab>
                <Tab>Editor Shortcuts</Tab>
                <Tab>Editor Completions</Tab>
            </TabList>

            <TabPanel>
                <FulcrumFaq />
            </TabPanel>
            <TabPanel>
                <GlobalShortcuts />
            </TabPanel>
            <TabPanel>
                <EditorShortcuts />
            </TabPanel>
            <TabPanel>
                <MarkdownCompletions />
            </TabPanel>
        </Tabs>
    )
}
