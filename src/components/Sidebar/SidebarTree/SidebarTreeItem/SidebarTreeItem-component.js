import React from 'reactn'

import { SidebarTreeItem } from './SidebarTreeItem-container'
import { SidebarTreeLink } from '../SidebarTreeLink'
import {
    filterChildFiles,
    getFolderId,
    shouldFileDisplay,
} from '../SidebarTree-helper'
import { getTitleFromFile } from '../../../../lib/helper'

export function SidebarTreeItemComponent(props) {
    const {
        classes,
        files,
        initialFiles,
        label,
        isExpanded,
        level,
        pageId,
        parentId,
        setExpanded,
    } = props
    return (
        <li>
            <SidebarTreeLink
                isExpanded={isExpanded}
                label={label}
                level={level}
                pageId={pageId}
                parentId={parentId}
                setExpanded={setExpanded}
            />
            {isExpanded && files && (
                <ul className={classes.ul}>
                    {files.map(file => {
                        const folderId = getFolderId(file.id, files)
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItem
                                    files={filterChildFiles(
                                        folderId,
                                        initialFiles
                                    )}
                                    key={file.id}
                                    label={getTitleFromFile(file)}
                                    level={level + 1}
                                    pageId={file.id}
                                    parentId={folderId}
                                />
                            )
                        }
                        return null
                    })}
                </ul>
            )}
        </li>
    )
}
