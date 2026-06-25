import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'
import { isEmpty } from 'lodash'
import { useFileTree } from 'lib/query/files-queries'

import { getPageId, isPage } from '../Sidebar-helper'
import {
    buildMyHomeTreeRoot,
    buildSidebarTreeIndexes,
    getExpandedAncestorPageIds,
} from './SidebarTree-helper'
import Spinner from '../../gsuite-components/spinner'
import { WikiSidebarTree } from './WikiSidebarTree'
import type { IFile } from 'types/app-state'

type SidebarTreeComponentProps = {
    rootFolderId: string | null
    initialFiles: IFile[]
}

export const SidebarTreeComponent = ({
    rootFolderId,
    initialFiles,
}: SidebarTreeComponentProps) => {
    const { isFetching } = useFileTree()
    const location = useLocation()

    const treeIndexes = useMemo(
        () => buildSidebarTreeIndexes(initialFiles),
        [initialFiles],
    )

    const myHomeRoot = useMemo(
        () => buildMyHomeTreeRoot(initialFiles, rootFolderId, treeIndexes),
        [initialFiles, rootFolderId, treeIndexes],
    )

    const currentPageId = isPage(location) ? getPageId(location) : null
    const expandedPageIds = useMemo(
        () =>
            currentPageId
                ? getExpandedAncestorPageIds(
                      currentPageId,
                      initialFiles,
                      rootFolderId,
                  )
                : new Set<string>(),
        [currentPageId, initialFiles, rootFolderId],
    )

    return (
        <>
            {isEmpty(initialFiles) && isFetching && (
                <Spinner style={{ marginTop: '2rem' }} />
            )}
            {(!isEmpty(initialFiles) || !isFetching) && myHomeRoot && (
                <WikiSidebarTree
                    aria-label="My wiki pages"
                    items={[myHomeRoot]}
                    routeExpandedKeys={expandedPageIds}
                />
            )}
        </>
    )
}
