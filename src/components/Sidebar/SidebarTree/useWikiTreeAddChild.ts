import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAppStore } from 'store/app-store'
import { useFileTree } from 'lib/query/files-queries'

import { createFile, createNewWiki } from 'db'
import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import { getParentFolderId } from '../Sidebar-helper'

export function useWikiTreeAddChild() {
    const { data: initialFiles = [] } = useFileTree()
    const navigate = useNavigate()

    return useCallback(
        async (pageId: string, parentFolderId: string | null) => {
            useAppStore.setState({ isCreatingNewFile: true })
            let parentFolderIdOfNewFile: string | undefined =
                parentFolderId ?? undefined
            try {
                if (!parentFolderIdOfNewFile) {
                    const resolvedParentFolderId = getParentFolderId(
                        pageId,
                        initialFiles,
                    )
                    parentFolderIdOfNewFile = await createNewWiki({
                        name: pageId,
                        parentId: resolvedParentFolderId,
                        isWikiRoot: false,
                    })
                }

                const newFileId = await createFile(
                    UNTITLEDFILE,
                    parentFolderIdOfNewFile,
                    EMPTYVALUE,
                )
                navigate({ href: `/page/${newFileId}?edit` })
            } catch (err) {
                useAppStore.setState({ isCreatingNewFile: false })
                console.log(err)
            }
        },
        [initialFiles, navigate],
    )
}
