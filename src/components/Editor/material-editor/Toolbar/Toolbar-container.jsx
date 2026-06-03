import React from 'react'
import { Tooltip } from '@material-ui/core'
import { ToggleButton } from '@material-ui/lab'

export const EditorToolbar = props => {
    return (
        <div className='bg-surface-paper border-b border-edge-strong flex max-w-100vw overflow-auto p-2 pl-5 sticky top-0 z-10 lg:top-14'>
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
