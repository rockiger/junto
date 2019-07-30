import React from 'react'

import { SlateEditor, SlateToolbar, SlateContent } from './slate-editor/src'
import { LinkPlugin, LinkButton } from './slate-editor-link-plugin/src'

const plugins = [LinkPlugin()]

const MaterialEditor = React.forwardRef((props, ref) => {
    return (
        <SlateEditor
            initialState={props.initialState}
            ref={ref}
            onChange={props.onChange}
        >
            <SlateToolbar>
                <LinkButton />
            </SlateToolbar>
            <SlateContent style={props.style} />
        </SlateEditor>
    )
})
export default MaterialEditor
