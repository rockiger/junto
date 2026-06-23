import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGlobal } from 'reactn'

import { createFile, createNewWiki } from 'db'
import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import { getParentFolderId } from '../Sidebar-helper'

export function useWikiTreeAddChild() {
    const [initialFiles] = useGlobal('initialFiles')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')
    const navigate = useNavigate()

    return useCallback(
        async (pageId: string, parentFolderId: string | null) => {
            setIsCreatingNewFile(true)
            let parentFolderIdOfNewFile: string | undefined =
                parentFolderId ?? undefined
            try {
                if (!parentFolderIdOfNewFile) {
                    const parentFolderId = getParentFolderId(
                        pageId,
                        initialFiles,
                    )
                    parentFolderIdOfNewFile = await createNewWiki({
                        name: pageId,
                        parentId: parentFolderId,
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
                setIsCreatingNewFile(false)
                console.log(err)
            }
        },
        [initialFiles, navigate, setIsCreatingNewFile],
    )
}
