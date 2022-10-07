import React, { useMemo, useState } from 'reactn'
import { shouldFileDisplay } from '../SidebarTree-helper'

import { SidebarTreeItemComponent } from './SidebarTreeItem-component'
import { useStyles } from './SidebarTreeItem-styles'

export function SidebarTreeItem(props) {
    const { expand = false, initialFiles, label, level, pageId } = props

    const [isExpanded, setExpanded] = useState(expand)

    const childFiles = useMemo(
        () => initialFiles.filter(file => shouldFileDisplay(file, pageId)),
        [initialFiles, pageId]
    )

    const classes = useStyles()

    if (!pageId) return null

    return (
        <SidebarTreeItemComponent
            classes={classes}
            childFiles={childFiles}
            initialFiles={initialFiles}
            label={label}
            isExpanded={isExpanded}
            level={level}
            pageId={pageId}
            hasChildren={!_.isEmpty(childFiles)}
            setExpanded={setExpanded}
        />
    )
}
