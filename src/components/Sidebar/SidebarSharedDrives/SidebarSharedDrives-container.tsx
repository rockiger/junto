import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useGlobal } from 'reactn'

import { getPageId, isPage } from '../Sidebar-helper'
import { filterWikis, sortWikisBy } from 'components/wiki-list'
import { filterIsNotArchived } from 'lib/helper/globalStateHelper'
import {
    buildSharedDriveTreeRoots,
    buildSidebarTreeIndexes,
    getExpandedAncestorPageIds,
    isPageUnderWikiRoot,
} from '../SidebarTree/SidebarTree-helper'
import { WikiSidebarTree } from '../SidebarTree/WikiSidebarTree'

export function SidebarSharedDrives() {
    const [initialFiles] = useGlobal('initialFiles')
    const location = useLocation()

    const currentPageId = isPage(location) ? getPageId(location) : null

    const sharedDriveWikiItems = useMemo(
        () =>
            sortWikisBy(
                'name',
                filterIsNotArchived(filterWikis(initialFiles)),
            ),
        [initialFiles],
    )
    const treeIndexes = useMemo(
        () => buildSidebarTreeIndexes(initialFiles),
        [initialFiles],
    )

    const sharedDriveRoots = useMemo(
        () =>
            buildSharedDriveTreeRoots(
                initialFiles,
                sharedDriveWikiItems,
                treeIndexes,
            ),
        [initialFiles, sharedDriveWikiItems, treeIndexes],
    )

    const routeExpandedKeys = useMemo(() => {
        if (!currentPageId) {
            return new Set<string>()
        }

        for (const file of sharedDriveWikiItems) {
            const wikiRootFolderId = file.parents[0]
            if (
                isPageUnderWikiRoot(
                    currentPageId,
                    wikiRootFolderId,
                    initialFiles,
                )
            ) {
                return getExpandedAncestorPageIds(
                    currentPageId,
                    initialFiles,
                    wikiRootFolderId,
                )
            }
        }

        return new Set<string>()
    }, [currentPageId, initialFiles, sharedDriveWikiItems])

    if (sharedDriveRoots.length === 0) {
        return null
    }

    return (
        <WikiSidebarTree
            aria-label="Shared drive wikis"
            items={sharedDriveRoots}
            routeExpandedKeys={routeExpandedKeys}
        />
    )
}
