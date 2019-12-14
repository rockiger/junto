import React, { useGlobal } from 'reactn'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'

import { SidebarTreeItem } from '../SidebarTree/SidebarTreeItem'
import { useStyles } from '../SidebarTree/SidebarTree-styles'
import { getTitleFromFile } from 'lib/helper'

export function SidebarSharedDrives() {
    const [initialFiles] = useGlobal('initialFiles')
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const [rootFolderId] = useGlobal('rootFolderId')
    const classes = useStyles()

    return (
        <ul className={classes.mydrive}>
            <li>
                <ul className={classes.mydrive}>
                    {filterSharedDrives(initialFiles).map((file, index) => (
                        <SidebarTreeItem
                            expand={false}
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
            file.properties.pageName
        // file.teamDriveId
        // TODO && parent[0] is
    )
}
