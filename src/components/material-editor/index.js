import React from 'react'

import { SlateEditor, SlateToolbar, SlateContent } from './slate-editor/src'
import { LinkPlugin, LinkButton } from './slate-editor-link-plugin/src'

const plugins = [LinkPlugin()]

const MaterialEditor = (props) => {
    return (
        <SlateEditor>
            <SlateToolbar>
                <LinkButton />
            </SlateToolbar>
            <SlateContent />
        </SlateEditor>
    )
}

export default MaterialEditor