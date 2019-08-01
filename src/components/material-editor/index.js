import React from 'react'

import { SlateEditor, SlateToolbar, SlateContent } from './slate-editor/src'
import {
    DriveButton,
    LinkPlugin,
    LinkButton,
} from './slate-editor-link-plugin/src'
import { ToggleReadOnlyButton } from './slate-editor-toggle-readonly/src/'
import Divider from './slate-editor-components/src/Divider'

const plugins = [LinkPlugin()]

const MaterialEditor = React.forwardRef((props, ref) => {
    console.log('initialState:', props.initialState)
    return (
        <SlateEditor
            initialState={props.initialState}
            ref={ref}
            onChange={props.onChange}
            plugins={plugins}
        >
            <SlateToolbar>
                <LinkButton />
                <DriveButton />
                <Divider />
                <ToggleReadOnlyButton />
            </SlateToolbar>
            <SlateContent style={props.style} />
        </SlateEditor>
    )
})
export default MaterialEditor
