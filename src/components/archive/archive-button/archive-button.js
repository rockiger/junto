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
                    onOk={alert.onOk}
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
                hierachy. They will not be archived. This movement of children con not be undone.`,
                isOpen: true,
                onOk: () => {}, //!
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
            //!
            setAlert({
                buttonText: 'Archive page',
                content: `All pages below this page will move one step up in the page
                hierachy. They will not be archived. This movement of children con not be undone.`,
                isOpen: true,
                onOk: () => {}, //!
                title: 'Archive page?',
            })
        } else {
            unArchiveSinglePageWithoutChilds(file)
        }
    }

    function archiveSinglePageWithoutChilds(file) {
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

/**
 * @typedef Alert
 * @property {string} buttonText
 * @property {React.ReactNode} content
 * @property {boolean} isOpen
 * @property {() => void} onOk
 * @property {string} title
 */

/** @type {Alert} */
const initialAlert = {
    buttonText: '',
    content: '',
    isOpen: false,
    onOk: () => {},
    title: '',
}
// Warning if has child pages
/* Diese Seite hat untergeordnete Seiten
Alle unter "Child 2" geschachtelten Seiten bleiben in der Seitenhierarchie erhalten. */
