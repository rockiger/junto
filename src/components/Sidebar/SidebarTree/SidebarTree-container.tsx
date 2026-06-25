import { useFileTree, useRootFolderId } from 'lib/query/files-queries'

import { SidebarTreeComponent } from './SidebarTree-component'

export const SidebarTree = () => {
    const rootFolderId = useRootFolderId()
    const { data: initialFiles = [] } = useFileTree()

    return (
        <SidebarTreeComponent
            initialFiles={initialFiles}
            rootFolderId={rootFolderId}
        />
    )
}
