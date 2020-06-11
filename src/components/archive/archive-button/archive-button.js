//@ts-check
import React, { useGlobal, useState } from 'reactn'

import ArchiveIconDown from 'mdi-react/ArchiveArrowDownOutlineIcon'
import ArchiveIconUp from 'mdi-react/ArchiveArrowUpIcon'
import { useSnackbar } from 'notistack'

import { Alert, IconButton } from 'components/gsuite-components'
import {
    filesUpdater,
    getMetaById,
    hasChildren,
    isArchived,
    isWikiRootFile,
} from 'lib/helper'

import s from './archive-button.module.scss'
import { updateMetadata } from 'lib/gdrive'

export default ArchiveButton
export { ArchiveButton }

/**
 * @typedef ArchiveButtonProps
 * @property {string} fileId
 */

/**
 * A archive-button component.
 * @param {ArchiveButtonProps} props
 */
function ArchiveButton({ fileId }) {
    const [global] = useGlobal()
    const [, setFiles] = useGlobal('files')
    const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [alert, setAlert] = useState(initialAlert)
    const file = getMetaById(fileId, initialFiles)

    return (
        <div className={s.ArchiveButton}>
            <IconButton
                id="HelpButton"
                onClick={
                    file && isArchived(file)
                        ? onClickUnArchiveButton
                        : onClickArchiveButton
                }
                selected={alert.isOpen}
                tooltip={
                    file && isArchived(file) ? 'Restore page' : 'Archive page'
                }
            >
                {file && isArchived(file) ? (
                    <ArchiveIconUp />
                ) : (
                    <ArchiveIconDown />
                )}
            </IconButton>
            {alert && (
                <Alert
                    isOpen={alert.isOpen}
                    okLabel={alert.buttonText}
                    onClose={onClose}
                    onOk={onClose}
                    maxWidth="sm"
                    title={alert.title}
                >
                    {alert.content}
                </Alert>
            )}
        </div>
    )

    function onClickArchiveButton() {
        const file = getMetaById(fileId, initialFiles)
        if (!file) return //something went wrong
        if (isWikiRootFile(file)) {
            setAlert({
                buttonText: 'Archive wiki',
                content:
                    'Do you want to archive this wiki? All pages in this wiki will be archived. The action can be undone.',
                isOpen: true,
                title: 'Archive wiki?',
            })
        } else if (hasChildren(fileId, initialFiles)) {
            setAlert({
                buttonText: 'Archive page',
                content: `All pages below this page will move one step up in the page
                hierachy. They will not be archived. This movement of children con not be undone.`,
                isOpen: true,
                title: 'Archive page?',
            })
        } else {
            archiveSinglePageWithoutChilds(file)
        }
    }

    function onClickUnArchiveButton() {
        const file = getMetaById(fileId, initialFiles)
        if (!file) return //something went wrong
        if (isWikiRootFile(file)) {
            //!
            setAlert({
                buttonText: 'Archive wiki',
                content:
                    'Do you want to archive this wiki? All pages in this wiki will be archived. The action can be undone.',
                isOpen: true,
                title: 'Archive wiki?',
            })
        } else if (hasChildren(fileId, initialFiles)) {
            //!
            setAlert({
                buttonText: 'Archive page',
                content: `All pages below this page will move one step up in the page
                hierachy. They will not be archived. This movement of children con not be undone.`,
                isOpen: true,
                title: 'Archive page?',
            })
        } else {
            unArchiveSinglePageWithoutChilds(file)
        }
    }

    function archiveSinglePageWithoutChilds(file) {
        console.log('archive page')
        const { properties } = file
        const newProperties = { ...properties, isArchived: true }
        const updatedFiles = filesUpdater(
            { properties: newProperties },
            global,
            file.id
        )
        setFiles(updatedFiles.files)
        setInitialFiles(updatedFiles.initialFiles)
        updateMetadata(file.id, { properties: newProperties })
        enqueueSnackbar('Page archived.', {
            autoHideDuration: 5000,
        })
    }

    function unArchiveSinglePageWithoutChilds(file) {
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
        updateMetadata(file.id, { properties: newProperties })
        enqueueSnackbar('Page restored.', {
            autoHideDuration: 5000,
        })
    }

    function onClose() {
        setAlert(initialAlert)
    }
}

const initialAlert = { buttonText: '', content: '', isOpen: false, title: '' }
// Warning if has child pages
/* Diese Seite hat untergeordnete Seiten
Alle unter "Child 2" geschachtelten Seiten bleiben in der Seitenhierarchie erhalten. */
