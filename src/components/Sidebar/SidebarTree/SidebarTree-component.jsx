import React, { useGlobal } from 'reactn'

import { useStyles } from './SidebarTree-styles'
import { SidebarTreeItem } from './SidebarTreeItem'
import { getOverviewFileId, sortFilesByName } from './SidebarTree-helper'
import Spinner from '../../gsuite-components/spinner'
import { MYHOME } from '../../../lib/constants'

export const SidebarTreeComponent = ({ rootFolderId, initialFiles }) => {
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const classes = useStyles()

    return (
        <>
            {_.isEmpty(initialFiles) && isInitialFileListLoading && (
                <Spinner style={{ marginTop: '2rem' }} />
            )}
            {(_.isNotEmpty(initialFiles) || !isInitialFileListLoading) && (
                <ul className={classes.mydrive}>
                    <SidebarTreeItem
                        expand={false}
                        initialFiles={sortFilesByName(initialFiles)}
                        label={MYHOME}
                        level={0}
                        pageId={getOverviewFileId(initialFiles, rootFolderId)}
                        parentId={rootFolderId}
                    />
                </ul>
            )}
        </>
    )
}
