import React from 'react'

import { SlateEditor, SlateToolbar, SlateContent } from './slate-editor/src'
import {
    DriveButton,
    LinkPlugin,
    LinkButton,
} from './slate-editor-link-plugin/src'
import { ToggleReadOnlyButton } from './slate-editor-toggle-readonly/src/'
import Divider from './slate-editor-components/src/Divider'
import { BoldButton, BoldPlugin } from './slate-editor-bold-plugin/src'

const plugins = [BoldPlugin(), LinkPlugin()]

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
                <BoldButton />

                <LinkButton />
                <DriveButton />
                <Divider />
                <ToggleReadOnlyButton save={props.save} />
            </SlateToolbar>
            <SlateContent style={props.style} />
        </SlateEditor>
    )
})
export default MaterialEditor
