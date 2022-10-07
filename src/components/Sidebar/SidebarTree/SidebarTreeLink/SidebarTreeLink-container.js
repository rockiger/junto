import { useDispatch, useGlobal, useState } from 'reactn'
import { useHistory, useLocation } from 'react-router-dom'

import { createPage } from 'db'
import { getPageId, isPage } from '../../Sidebar-helper'
import { SidebarTreeLinkComponent } from './SidebarTreeLink-component'
import { useStyles } from './SidebarTreeLink-styles'
export function SidebarTreeLink(props) {
    const { isExpanded, label, level, pageId, hasChildren, setExpanded } = props

    const clearSearch = useDispatch('clearSearch')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')

    const [showAddButton, setShowAddButton] = useState(false)

    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()

    const currentPageId = isPage(location) ? getPageId(location) : null

    async function onClickAddButton(ev) {
        ev.preventDefault(ev)

        const title = window.prompt('New filename')
        if (title) {
            try {
                // create new child page
                const page = await createPage({
                    title: title,
                    parentId: pageId,
                })
                history.push(`/page/${page.id}?edit`)
            } catch (err) {
                setIsCreatingNewFile(false)
                window.err = err
                console.log(err)
            }
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
            onCLickAddButton={onClickAddButton}
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
