import React, { useGlobal, useState } from 'reactn'

import { SidebarTreeItemComponent } from './SidebarTreeItem-component'
import { useStyles } from './SidebarTreeItem-styles'

export function SidebarTreeItem(props) {
    const { expand = false, files, label, level, pageId, parentId } = props
    const [initialFiles] = useGlobal('initialFiles')

    const [isExpanded, setExpanded] = useState(expand)

    const classes = useStyles()

    return (
        <SidebarTreeItemComponent
            classes={classes}
            files={files}
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
