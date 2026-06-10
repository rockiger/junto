// @ts-nocheck
import React from 'reactn'
import { useLocation, useNavigate } from '@tanstack/react-router'

import {
    getPageId,
    getParentFolderId,
    getParentFolderIdOfNewFile,
    isPage,
} from './Sidebar-helper'
import { createFile, createNewWiki } from 'db'
import { UNTITLEDFILE, EMPTYVALUE } from '../../lib/constants'
import SidebarRenderer from './Sidebar-component'

class Sidebar extends React.Component {
    onClickNewButton = async ev => {
        this.setGlobal({ isCreatingNewFile: true })
        let parentFolderIdOfNewFile
        console.log(isPage(this.props.location))
        if (isPage(this.props.location)) {
            const pageId = getPageId(this.props.location)
            parentFolderIdOfNewFile = getParentFolderIdOfNewFile(
                pageId,
                this.global.initialFiles
            )
            if (!parentFolderIdOfNewFile) {
                const parentFolderId = getParentFolderId(
                    pageId,
                    this.global.initialFiles
                )
                try {
                    parentFolderIdOfNewFile = await createNewWiki({
                        name: pageId,
                        parentId: parentFolderId,
                        isWikiRoot: false,
                    })
                } catch (err) {
                    this.setGlobal({ isCreatingNewFile: false })
                    console.log(err)
                }
            }
        } else {
            parentFolderIdOfNewFile = this.global.rootFolderId
        }

        try {
            this.setGlobal({
                goToNewFile: true,
                searchTerm: '',
            })
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile,
                JSON.stringify(EMPTYVALUE)
            )
            this.props.navigate({
                href: `/page/${newFileId}?edit`,
            })
        } catch (err) {
            this.setGlobal({ isCreatingNewFile: false })
            console.log(err)
        }
    }

    render() {
        return <SidebarRenderer onClickNewButton={this.onClickNewButton} />
    }
}

function SidebarWithRouter(props) {
    const navigate = useNavigate()
    const location = useLocation()
    return <Sidebar {...props} navigate={navigate} location={location} />
}

export default SidebarWithRouter
