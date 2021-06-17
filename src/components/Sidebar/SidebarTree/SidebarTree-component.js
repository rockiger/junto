import React, { useGlobal } from 'reactn'

import { useStyles } from './SidebarTree-styles'
import { SidebarTreeItem } from './SidebarTreeItem'
import { getOverviewFileId, sortFilesByName } from './SidebarTree-helper'
import Spinner from '../../gsuite-components/spinner'
import { MYHOME } from '../../../lib/constants'

export const SidebarTreeComponent = ({ rootFolderId, files }) => {
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const classes = useStyles()
    return (
        <>
            {isInitialFileListLoading && (
                <Spinner style={{ marginTop: '2rem' }} />
            )}
            {!isInitialFileListLoading && (
                <ul className={classes.mydrive}>
                    <SidebarTreeItem
                        expand={false}
                        files={sortFilesByName(files)}
                        label={MYHOME}
                        level={0}
                        pageId={getOverviewFileId(files, rootFolderId)}
                        parentId={rootFolderId}
                    />
                </ul>
            )}
        </>
    )
}
