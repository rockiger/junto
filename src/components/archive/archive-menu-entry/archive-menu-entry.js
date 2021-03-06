//@ts-check
import React, { useGlobal, useState } from 'reactn'

import ArchiveIconDown from 'mdi-react/ArchiveArrowDownOutlineIcon'
import ArchiveIconUp from 'mdi-react/ArchiveArrowUpIcon'
import { useSnackbar } from 'notistack'

import {
    Alert,
    emptyAlert as initialAlert,
} from 'components/gsuite-components/alert'
import {
    filesUpdater,
    getMetaById,
    hasChildren,
    isArchived,
    isWikiRootFile,
} from 'lib/helper'

import { updateMetadata, moveFile } from 'lib/gdrive'

export default ArchiveMenuEntry
export { ArchiveMenuEntry }

/**
 * @typedef ArchiveButtonProps
 * @property {string} fileId
 */

/**
 * A archive-button component.
 * @param {ArchiveButtonProps} props
 */
function ArchiveMenuEntry({ fileId }) {
    const [global] = useGlobal()
    const [, setFiles] = useGlobal('files')
    const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
    const { enqueueSnackbar } = useSnackbar()
    const [alert, setAlert] = useState(initialAlert)
    const file = getMetaById(fileId, initialFiles)

    const ArchiveAlert = alert
        ? props => (
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
        const file = getMetaById(fileId, initialFiles)
        if (!file) return //something went wrong
        if (isWikiRootFile(file)) {
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
                    archiveSinglePageWithoutChilds(file)
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
                    archiveSinglePageWithChildren(file)
                    setAlert(initialAlert)
                },
                title: 'Archive page with children?',
            })
        } else {
            archiveSinglePageWithoutChilds(file)
        }
    }

    function onClickUnArchiveButton() {
        const file = getMetaById(fileId, initialFiles)
        if (!file) return //something went wrong
        if (isWikiRootFile(file)) {
            setAlert({
                buttonText: 'Restore wiki',
                content:
                    'Do you want to restore this wiki? All pages in this wiki will be restored, unless they were archived seperately.',
                isOpen: true,
                onOk: () => {
                    unArchiveSinglePageWithoutChilds(file)
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
                onOk: () => {}, //!
                title: 'Archive page?',
            })
        } else {
            unArchiveSinglePageWithoutChilds(file)
        }
    }

    async function archiveSinglePageWithChildren(file) {
        // Change parent of children
        const newParentFolderId = file.parents ? file.parents[0] : null
        if (!newParentFolderId) return

        const folder = initialFiles.find(f => f.name === file.id)
        console.log(folder)
        if (folder) {
            const children = initialFiles.filter(
                f => f.parents && f.parents.includes(folder.id)
            )
            console.log(children)
            let globalTmp = { ...global }
            for (const child of children) {
                const newParents = [newParentFolderId]
                const updatedFiles = filesUpdater(
                    { parents: newParents },
                    globalTmp,
                    child.id
                )
                globalTmp = {
                    ...globalTmp,
                    files: updatedFiles.files,
                    initialFiles: updatedFiles.initialFiles,
                }
            }
            setFiles(globalTmp.files)
            setInitialFiles(globalTmp.initialFiles)

            for (const child of children) {
                const currentParentFolder = child.parents
                    ? child.parents[0]
                    : null
                if (currentParentFolder) {
                    await moveFile(
                        child.id,
                        currentParentFolder,
                        newParentFolderId
                    )
                }
            }
            // Archive SinglePage
            archiveSinglePageWithoutChilds(file)
        }
    }

    async function archiveSinglePageWithoutChilds(file) {
        console.log('archive page')
        const { properties } = file
        const newProperties = { ...properties, isArchived: 'true' }
        const updatedFiles = filesUpdater(
            { properties: newProperties },
            global,
            file.id
        )
        setFiles(updatedFiles.files)
        setInitialFiles(updatedFiles.initialFiles)
        await updateMetadata(file.id, { properties: newProperties })
        enqueueSnackbar('Page archived.', {
            autoHideDuration: 5000,
        })
    }

    async function unArchiveSinglePageWithoutChilds(file) {
        console.log('archive page')
        const { properties } = file
        const newProperties = { ...properties, isArchived: false }
        const updatedFiles = filesUpdater(
            { properties: newProperties },
            global,
            file.id
        )
        setFiles(updatedFiles.files)
        setInitialFiles(updatedFiles.initialFiles)
        await updateMetadata(file.id, { properties: newProperties })
        enqueueSnackbar('Page restored.', {
            autoHideDuration: 5000,
        })
    }

    function onClose() {
        setAlert(initialAlert)
    }
}

// Warning if has child pages
/* Diese Seite hat untergeordnete Seiten
Alle unter "Child 2" geschachtelten Seiten bleiben in der Seitenhierarchie erhalten. */
