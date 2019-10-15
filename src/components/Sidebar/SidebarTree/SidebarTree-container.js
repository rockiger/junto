import React, { useGlobal } from 'reactn'

import { SidebarTreeComponent } from './SidebarTree-component'

import { OVERVIEW_NAME } from '../../../lib/constants'

export const SidebarTree = props => {
    const [rootFolderId] = useGlobal('rootFolderId')
    const [files] = useGlobal('files')

    console.log(filterOverview(files))
    return (
        <SidebarTreeComponent
            rootFolderId={rootFolderId}
            files={filterOverview(files)}
        />
    )
}

function filterOverview(files) {
    return files.filter(file => {
        if (file.name === OVERVIEW_NAME) return false
        return true
    })
}
