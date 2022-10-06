import { useDispatch, useGlobal, useState } from 'reactn'
import { useHistory, useLocation } from 'react-router-dom'

import { createFile, createNewWiki } from 'db'
import { EMPTYVALUE, UNTITLEDFILE } from 'lib/constants'
import { getPageId, getParentFolderId, isPage } from '../../Sidebar-helper'
import { SidebarTreeLinkComponent } from './SidebarTreeLink-component'
import { useStyles } from './SidebarTreeLink-styles'
export function SidebarTreeLink(props) {
    const { isExpanded, label, level, pageId, hasChildren, setExpanded } = props

    const clearSearch = useDispatch('clearSearch')
    const [initialFiles] = useGlobal('initialFiles')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')

    const [showAddButton, setShowAddButton] = useState(false)

    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()

    const currentPageId = isPage(location) ? getPageId(location) : null

    async function onCLickAddButton(ev) {
        ev.preventDefault(ev)

        setIsCreatingNewFile(true)
        let parentFolderIdOfNewFile = pageId
        try {
            // check if the current page has already a folder for child
            // pages, if not create a new one.
            if (!parentFolderIdOfNewFile) {
                const parentFolderId = getParentFolderId(pageId, initialFiles)
                parentFolderIdOfNewFile = await createNewWiki({
                    name: pageId,
                    parentId: pageId,
                    isWikiRoot: false,
                })
            }

            // create new child page
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile,
                JSON.stringify(EMPTYVALUE)
            )
            history.push(`/page/${newFileId}?edit`)
        } catch (err) {
            setIsCreatingNewFile(false)
            console.log(err)
        }
    }

    function onClickTreeButton(ev) {
        ev.preventDefault()
        ev.stopPropagation()
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
                backgroundColor: currentPageId === pageId ? '#e8f0fe' : '',
                color: currentPageId === pageId ? '#4285f4' : '',
                paddingLeft: level * 16,
            }}
            onClick={clearSearch}
            onCLickAddButton={onCLickAddButton}
            onClickTreeButton={onClickTreeButton}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            openButtonStyle={{
                color: currentPageId === pageId ? '#4285f4' : '',
                flexShrink: 0,
                margin: '0 3px',
                padding: 0,
            }}
            pageId={pageId}
            hasChildren={hasChildren}
            showAddButton={showAddButton}
        />
    )
}
