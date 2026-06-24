import { useAppStore } from 'store/app-store'

import { SidebarTreeComponent } from './SidebarTree-component'

export const SidebarTree = () => {
    const rootFolderId = useAppStore((s) => s.rootFolderId)
    const initialFiles = useAppStore((s) => s.initialFiles)

    return (
        <SidebarTreeComponent
            initialFiles={initialFiles}
            rootFolderId={rootFolderId}
        />
    )
}
