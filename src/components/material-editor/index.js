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
import { ItalicButton, ItalicPlugin } from './slate-editor-italic-plugin/src'
import {
    UnderlinePlugin,
    UnderlineButton,
} from './slate-editor-underline-plugin/src'
import {
    StrikethroughButton,
    StrikethroughPlugin,
} from './slate-editor-strikethrough-plugin/src'

const plugins = [
    BoldPlugin(),
    ItalicPlugin(),
    LinkPlugin(),
    StrikethroughPlugin(),
    UnderlinePlugin(),
]

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
                <ItalicButton />
                <UnderlineButton />
                <StrikethroughButton />

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
