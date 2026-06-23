import { useGlobal } from 'reactn'

import { SidebarTreeComponent } from './SidebarTree-component'

export const SidebarTree = () => {
    const [rootFolderId] = useGlobal('rootFolderId')
    const [initialFiles] = useGlobal('initialFiles')

    return (
        <SidebarTreeComponent
            initialFiles={initialFiles}
            rootFolderId={rootFolderId}
        />
    )
}
