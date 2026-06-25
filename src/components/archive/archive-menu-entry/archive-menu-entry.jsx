//@ts-check
import { useState } from 'react'

import ArchiveIconDown from 'mdi-react/ArchiveArrowDownOutlineIcon'
import ArchiveIconUp from 'mdi-react/ArchiveArrowUpIcon'
import { useSnackbar } from 'notistack'

import {
    Alert,
    emptyAlert as initialAlert,
} from 'components/gsuite-components/alert'
import {
    getMetaById,
    hasChildren,
    isArchived,
    isWikiRootFile,
} from 'lib/helper'
import { patchFileCaches } from 'lib/query/files-cache'
import { queryClient } from 'lib/query/query-client'
import { useFileTree } from 'lib/query/files-queries'

import { updateMetadata, moveFile } from 'lib/gdrive'

export default ArchiveMenuEntry
export { ArchiveMenuEntry }

/**
 * @typedef ArchiveButtonProps
 * @property {string} fileId
 */

/**
 * @param {ArchiveButtonProps} props
 */
export function useArchiveMenuEntry({ fileId }) {
    const { data: initialFiles = [] } = useFileTree()
    const { enqueueSnackbar } = useSnackbar()
    const [alert, setAlert] = useState(initialAlert)
    const file = getMetaById(fileId, initialFiles)

    const ArchiveAlert = alert
        ? () => (
              <Alert
                  isOpen={alert.isOpen}
                  okLabel={alert.buttonText}
                  onClose={onClose}
                  onOk={alert.onOk}
                  maxWidth="sm"
                  title={alert.title}
              >
                  {alert.content}
              </Alert>
          )
        : null

    return {
        title: file && isArchived(file) ? 'Restore' : 'Archive',
        handler:
            file && isArchived(file)
                ? onClickUnArchiveButton
                : onClickArchiveButton,
        icon: file && isArchived(file) ? ArchiveIconUp : ArchiveIconDown,
        ArchiveAlert,
    }

    function onClickArchiveButton() {
        const currentFile = getMetaById(fileId, initialFiles)
        if (!currentFile) return
        if (isWikiRootFile(currentFile)) {
            setAlert({
                buttonText: 'Archive wiki',
                content: (
                    <>
                        <p>
                            Do you want to archive this wiki? All pages in this
                            wiki will be archived.
                        </p>
                        <p>
                            Archiving this wiki will remove it from the site
                            navigation, to clear up the navigation and make it
                            easier to find relevant content.
                        </p>
                        <p>
                            If you need the content from this space at later
                            time, you can restore the space anytime.
                        </p>
                    </>
                ),
                isOpen: true,
                onOk: () => {
                    archiveSinglePageWithoutChilds(currentFile)
                    setAlert(initialAlert)
                },
                title: 'Archive whole wiki?',
            })
        } else if (hasChildren(fileId, initialFiles)) {
            setAlert({
                buttonText: 'Archive page',
                content: `All pages below this page will move one step up in the page
                hierachy. They will not be archived. This movement of children can not be undone.`,
                isOpen: true,
                onOk: () => {
                    archiveSinglePageWithChildren(currentFile)
                    setAlert(initialAlert)
                },
                title: 'Archive page with children?',
            })
        } else {
            archiveSinglePageWithoutChilds(currentFile)
        }
    }

    function onClickUnArchiveButton() {
        const currentFile = getMetaById(fileId, initialFiles)
        if (!currentFile) return
        if (isWikiRootFile(currentFile)) {
            setAlert({
                buttonText: 'Restore wiki',
                content:
                    'Do you want to restore this wiki? All pages in this wiki will be restored, unless they were archived seperately.',
                isOpen: true,
                onOk: () => {
                    unArchiveSinglePageWithoutChilds(currentFile)
                    setAlert(initialAlert)
                },
                title: 'Restore whole wiki?',
            })
        } else if (hasChildren(fileId, initialFiles)) {
            setAlert({
                buttonText: 'Archive page',
                content: `All pages below this page will move one step up in the page
                hierachy. They will not be archived. This movement of children can not be undone.`,
                isOpen: true,
                onOk: () => {},
                title: 'Archive page?',
            })
        } else {
            unArchiveSinglePageWithoutChilds(currentFile)
        }
    }

    /** @param {import('types/app-state').IFile} archiveFile */
    async function archiveSinglePageWithChildren(archiveFile) {
        const newParentFolderId = archiveFile.parents ? archiveFile.parents[0] : null
        if (!newParentFolderId) return

        const folder = initialFiles.find((f) => f.name === archiveFile.id)
        if (folder) {
            const children = initialFiles.filter(
                (f) => f.parents && f.parents.includes(folder.id),
            )
            for (const child of children) {
                const newParents = [newParentFolderId]
                patchFileCaches(queryClient, { parents: newParents }, child.id)
            }

            for (const child of children) {
                const currentParentFolder = child.parents
                    ? child.parents[0]
                    : null
                if (currentParentFolder) {
                    await moveFile(
                        child.id,
                        currentParentFolder,
                        newParentFolderId,
                    )
                }
            }
            archiveSinglePageWithoutChilds(archiveFile)
        }
    }

    /** @param {import('types/app-state').IFile} archiveFile */
    async function archiveSinglePageWithoutChilds(archiveFile) {
        const { properties } = archiveFile
        const newProperties = { ...properties, isArchived: 'true' }
        patchFileCaches(
            queryClient,
            { properties: newProperties },
            archiveFile.id,
        )
        await updateMetadata(archiveFile.id, { properties: newProperties })
        enqueueSnackbar('Page archived.', {
            autoHideDuration: 5000,
        })
    }

    /** @param {import('types/app-state').IFile} archiveFile */
    async function unArchiveSinglePageWithoutChilds(archiveFile) {
        const { properties } = archiveFile
        const newProperties = { ...properties, isArchived: false }
        patchFileCaches(
            queryClient,
            { properties: newProperties },
            archiveFile.id,
        )
        await updateMetadata(archiveFile.id, { properties: newProperties })
        enqueueSnackbar('Page restored.', {
            autoHideDuration: 5000,
        })
    }

    function onClose() {
        setAlert(initialAlert)
    }
}

/**
 * A archive-button component.
 * @param {ArchiveButtonProps} props
 */
function ArchiveMenuEntry(props) {
    return useArchiveMenuEntry(props)
}
