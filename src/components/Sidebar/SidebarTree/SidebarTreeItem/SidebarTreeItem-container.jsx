import React, { useState } from 'reactn'

import { SidebarTreeItemComponent } from './SidebarTreeItem-component'
import { useStyles } from './SidebarTreeItem-styles'

export function SidebarTreeItem(props) {
    const {
        expand = false,
        initialFiles,
        label,
        level,
        pageId,
        parentId,
    } = props

    const [isExpanded, setExpanded] = useState(expand)

    const classes = useStyles()

    return (
        <SidebarTreeItemComponent
            classes={classes}
            initialFiles={initialFiles}
            label={label}
            isExpanded={isExpanded}
            level={level}
            pageId={pageId}
            parentId={parentId}
            setExpanded={setExpanded}
        />
    )
}
