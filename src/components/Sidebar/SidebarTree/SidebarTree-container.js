import React, { useGlobal } from 'reactn'

import { SidebarTreeComponent } from './SidebarTree-component'

import { OVERVIEW_NAME } from '../../../lib/constants'

export const SidebarTree = props => {
    const [rootFolderId] = useGlobal('rootFolderId')
    const [files] = useGlobal('files')

    return <SidebarTreeComponent files={files} rootFolderId={rootFolderId} />
}
