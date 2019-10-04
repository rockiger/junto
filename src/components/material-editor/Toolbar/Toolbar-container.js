import React from 'react'
import { Tooltip } from '@material-ui/core'
import { ToggleButton } from '@material-ui/lab'

export const EditorToolbar = props => {
    return (
        <div style={{ border: '1px solid #ccc', padding: 8 }}>
            {props.children}
        </div>
    )
}

export const ToolbarButton = ({ active, value, shortcut, ...props }) => {
    return (
        <Tooltip enterDelay={200} leaveDelay={100} title={shortcut}>
            <ToggleButton
                {...props}
                selected={active}
                size="small"
                style={{ height: 24, padding: 0 }}
                value={value}
            >
                {props.children}
            </ToggleButton>
        </Tooltip>
    )
}

export default EditorToolbar
