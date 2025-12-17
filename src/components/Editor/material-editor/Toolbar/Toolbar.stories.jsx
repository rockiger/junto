import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { ToggleButtonGroup } from '@material-ui/lab'
import FormatAlignLeftIcon from 'mdi-react/FormatAlignLeftIcon'
import FormatAlignCenterIcon from 'mdi-react/FormatAlignCenterIcon'
import FormatAlignRightIcon from 'mdi-react/FormatAlignRightIcon'
import FormatAlignJustifyIcon from 'mdi-react/FormatAlignJustifyIcon'

import EditorToolbar, { ToolbarButton } from './Toolbar-container'

storiesOf('Toolbar', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', Toolbar)

function Toolbar() {
    return (
        <EditorToolbar>
            <ToggleButtonGroup value="center" exclusive size="small">
                <ToolbarButton size="small" value="left">
                    <FormatAlignLeftIcon style={{ height: 18 }} />
                </ToolbarButton>
                <ToolbarButton size="small" value="center">
                    <FormatAlignCenterIcon style={{ height: 18 }} />
                </ToolbarButton>
                <ToolbarButton size="small" value="right">
                    <FormatAlignRightIcon style={{ height: 18 }} />
                </ToolbarButton>
                <ToolbarButton size="small" value="justify" disabled>
                    <FormatAlignJustifyIcon style={{ height: 18 }} />
                </ToolbarButton>
            </ToggleButtonGroup>
        </EditorToolbar>
    )
}
