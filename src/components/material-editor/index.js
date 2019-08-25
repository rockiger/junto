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
import {
    AlignmentPlugin,
    AlignmentButtonBar,
} from './slate-editor-alignment-plugin/src'
import { ListPlugin, ListButtonBar } from './slate-editor-list-plugin/src'
import { HeaderPlugin, HeaderButtonBar } from './slate-editor-header-plugin/src'
import { ImagePlugin /*ImageButton*/ } from './slate-editor-image-plugin/src'

import { isMobileDevice } from '../../lib/helper'

const plugins = [
    AlignmentPlugin(),
    BoldPlugin(),
    HeaderPlugin(),
    ImagePlugin(),
    ItalicPlugin(),
    LinkPlugin(),
    ListPlugin(),
    StrikethroughPlugin(),
    UnderlinePlugin(),
]

const MaterialEditor = React.forwardRef((props, ref) => {
    return (
        <SlateEditor
            initialState={props.initialState}
            ref={ref}
            onChange={props.onChange}
            plugins={plugins}
            save={props.save}
        >
            <SlateToolbar>
                <HeaderButtonBar />

                <Divider />

                <BoldButton />
                <ItalicButton />
                <UnderlineButton />
                <StrikethroughButton />

                <Divider />

                <LinkButton />
                {/* Wait till picker feature is finished */}
                {/* <ImageButton /> */}
                {<DriveButton />}

                <Divider />

                <AlignmentButtonBar />

                <Divider />

                <ListButtonBar />

                <Divider />

                {!isMobileDevice() && (
                    <ToggleReadOnlyButton save={props.save} />
                )}
            </SlateToolbar>
            <SlateContent style={props.style} />
        </SlateEditor>
    )
})
export default MaterialEditor
