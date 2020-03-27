import React, { useGlobal } from 'reactn'
import { OVERVIEW_NAME } from 'lib/constants'

import { SidebarTreeItem } from '../SidebarTree/SidebarTreeItem'
import { useStyles } from '../SidebarTree/SidebarTree-styles'
import { getTitleFromFile } from 'lib/helper'

export function SidebarSharedDrives() {
    const [initialFiles] = useGlobal('initialFiles')
    const classes = useStyles()

    return (
        <ul className={classes.mydrive}>
            <li>
                <ul className={classes.mydrive}>
                    {filterSharedDrives(initialFiles).map((file, index) => (
                        <SidebarTreeItem
                            expand={false}
                            key={index}
                            files={initialFiles}
                            label={getTitleFromFile(file)}
                            level={0}
                            pageId={file.id}
                            parentId={file.parents[0]}
                        />
                    ))}
                </ul>
            </li>
        </ul>
    )
}

function filterSharedDrives(files) {
    return files.filter(
        file =>
            file.name === OVERVIEW_NAME &&
            file.properties &&
            file.properties.pageName &&
            file.parents[0] &&
            isParentFolderNotDeleted(file, files)
        // file.teamDriveId
        // TODO && parent[0] is
    )
}

function isParentFolderNotDeleted(childFile, files) {
    const parentId = childFile.parents[0]
    const parents = files.filter(file => file.id === parentId)
    return parents[0] && parents[0].trashed === false
}
