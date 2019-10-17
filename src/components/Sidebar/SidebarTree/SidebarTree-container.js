import React, { useGlobal } from 'reactn'

import { SidebarTreeComponent } from './SidebarTree-component'

import { OVERVIEW_NAME } from '../../../lib/constants'

export const SidebarTree = props => {
    const [rootFolderId] = useGlobal('rootFolderId')
    const [initialFiles] = useGlobal('initialFiles')

    return (
        <SidebarTreeComponent
            files={initialFiles}
            rootFolderId={rootFolderId}
        />
    )
}
