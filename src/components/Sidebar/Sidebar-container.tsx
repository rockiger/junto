// @ts-nocheck
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { setAppState } from 'store/app-store'
import { getFileTree } from 'lib/query/files-cache'
import { queryClient } from 'lib/query/query-client'
import { queryKeys } from 'lib/query/query-keys'

import {
    getPageId,
    getParentFolderId,
    getParentFolderIdOfNewFile,
    isPage,
} from './Sidebar-helper'
import { createFile, createNewWiki } from 'db'
import { UNTITLEDFILE, EMPTYVALUE } from '../../lib/constants'
import SidebarRenderer from './Sidebar-component'

function SidebarWithRouter() {
    const navigate = useNavigate()
    const location = useLocation()

    const onClickNewButton = useCallback(async () => {
        setAppState({ isCreatingNewFile: true })
        let parentFolderIdOfNewFile
        const initialFiles = getFileTree(queryClient)
        const rootFolderId =
            queryClient.getQueryData(queryKeys.rootFolderId) ?? null
        console.log(isPage(location))
        if (isPage(location)) {
            const pageId = getPageId(location)
            parentFolderIdOfNewFile = getParentFolderIdOfNewFile(
                pageId,
                initialFiles,
            )
            if (!parentFolderIdOfNewFile) {
                const parentFolderId = getParentFolderId(pageId, initialFiles)
                try {
                    parentFolderIdOfNewFile = await createNewWiki({
                        name: pageId,
                        parentId: parentFolderId,
                        isWikiRoot: false,
                    })
                } catch (err) {
                    setAppState({ isCreatingNewFile: false })
                    console.log(err)
                }
            }
        } else {
            parentFolderIdOfNewFile = rootFolderId
        }

        try {
            setAppState({ goToNewFile: true })
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile,
                EMPTYVALUE,
            )
            navigate({
                href: `/page/${newFileId}?edit`,
            })
        } catch (err) {
            setAppState({ isCreatingNewFile: false })
            console.log(err)
        }
    }, [location, navigate])

    return <SidebarRenderer onClickNewButton={onClickNewButton} />
}

export default SidebarWithRouter
