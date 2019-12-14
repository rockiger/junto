import React, { useGlobal, useState } from 'reactn'
import { useHistory, useLocation } from 'react-router-dom'

import { SidebarTreeLinkComponent } from './SidebarTreeLink-component'
import { useStyles } from './SidebarTreeLink-styles'

import { getPageId, getParentFolderId, isPage } from '../../Sidebar-helper'
import { createFile, updateFile, createNewWiki } from '../../../../lib/gdrive'
import { EMPTYVALUE, UNTITLEDFILE } from '../../../../lib/constants'

export function SidebarTreeLink(props) {
    const { isExpanded, label, level, pageId, parentId, setExpanded } = props

    const [initialFiles] = useGlobal('initialFiles')
    const [, setGoToNewFile] = useGlobal('goToNewFile')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [, setBackgroundUpdate] = useGlobal('backgroundUpdate')
    const [, setSearchTerm] = useGlobal('searchTerm')

    const [showAddButton, setShowAddButton] = useState(false)

    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()

    const currentPageId = isPage(location) ? getPageId(location) : null

    async function onCLickAddButton(ev) {
        ev.preventDefault(ev)

        setIsCreatingNewFile(true)
        let parentFolderIdOfNewFile = parentId
        if (!parentFolderIdOfNewFile) {
            const parentFolderId = getParentFolderId(pageId, initialFiles)
            try {
                parentFolderIdOfNewFile = await createNewWiki(
                    pageId,
                    parentFolderId
                )
            } catch (err) {
                setIsCreatingNewFile(false)
                console.log(err)
            }
        }

        try {
            console.log(parentFolderIdOfNewFile)
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile
            )
            console.log({ newFileId })
            const result = await updateFile(
                newFileId,
                JSON.stringify(EMPTYVALUE)
            )

            console.log(result)

            setGoToNewFile(true)
            setSearchTerm('')
            setIsCreatingNewFile(false)
            setBackgroundUpdate(true)
            history.push(`/page/${newFileId}?edit`)
        } catch (err) {
            setIsCreatingNewFile(false)
            console.log(err)
        }
    }

    function onClickTreeButton(ev) {
        ev.preventDefault()
        setExpanded(!isExpanded)
    }

    function onMouseEnter(ev) {
        setShowAddButton(true)
    }

    function onMouseLeave(ev) {
        setShowAddButton(false)
    }

    return (
        <SidebarTreeLinkComponent
            classes={classes}
            isExpanded={isExpanded}
            label={label}
            linkStyle={{
                backgroundColor:
                    currentPageId === pageId ? 'var(--hover-bg-color)' : '',
                color: currentPageId === pageId ? 'var(--primary-color)' : '',
                paddingLeft: level * 16,
            }}
            onCLickAddButton={onCLickAddButton}
            onClickTreeButton={onClickTreeButton}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            openButtonStyle={{
                color: currentPageId === pageId ? 'var(--primary-color)' : '',
                flexShrink: 0,
                margin: '0 3px',
                padding: 0,
            }}
            pageId={pageId}
            parentId={parentId}
            showAddButton={showAddButton}
        />
    )
}
