import React from 'reactn'

import { SidebarTreeItem } from './SidebarTreeItem-container'
import { SidebarTreeLink } from '../SidebarTreeLink'
import { getFolderId, shouldFileDisplay } from '../SidebarTree-helper'

function resolveFolderId(fileId, initialFiles, treeIndexes) {
    if (treeIndexes) {
        return treeIndexes.folderIdByPageId.get(fileId) ?? null
    }
    return getFolderId(fileId, initialFiles)
}
import { getTitleFromFile } from '../../../../lib/helper'

export function SidebarTreeItemComponent(props) {
    const {
        classes,
        initialFiles,
        label,
        isExpanded,
        level,
        pageId,
        parentId,
        setExpanded,
        treeIndexes,
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
            {isExpanded && initialFiles && (
                <ul className={classes.ul}>
                    {initialFiles.map(file => {
                        const folderId = resolveFolderId(
                            file.id,
                            initialFiles,
                            treeIndexes,
                        )
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItem
                                    initialFiles={initialFiles}
                                    key={file.id}
                                    label={getTitleFromFile(file)}
                                    level={level + 1}
                                    pageId={file.id}
                                    parentId={folderId}
                                    treeIndexes={treeIndexes}
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
