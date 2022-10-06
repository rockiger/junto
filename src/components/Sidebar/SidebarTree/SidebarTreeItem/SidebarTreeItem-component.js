import React from 'reactn'

import { SidebarTreeItem } from './SidebarTreeItem-container'
import { SidebarTreeLink } from '../SidebarTreeLink'
import { getFolderId, shouldFileDisplay } from '../SidebarTree-helper'
import { getTitleFromFile } from '../../../../lib/helper'

export function SidebarTreeItemComponent(props) {
    const {
        classes,
        childFiles,
        initialFiles,
        label,
        isExpanded,
        level,
        pageId,
        hasChildren,
        setExpanded,
    } = props
    return (
        <li>
            <SidebarTreeLink
                isExpanded={isExpanded}
                label={label}
                level={level}
                pageId={pageId}
                hasChildren={hasChildren}
                setExpanded={setExpanded}
            />
            {isExpanded && childFiles && (
                <ul className={classes.ul}>
                    {childFiles.map(file => (
                        <SidebarTreeItem
                            initialFiles={initialFiles}
                            key={file.id}
                            label={getTitleFromFile(file)}
                            level={level + 1}
                            pageId={file.id}
                            parentId={file.parentId}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}
