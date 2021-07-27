import React from 'reactn'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import {
    getPageId,
    getParentFolderId,
    getParentFolderIdOfNewFile,
    isPage,
} from './Sidebar-helper'
import { createFile } from 'db'
import { createNewWiki } from 'lib/gdrive'
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
            this.props.history.push(`/page/${newFileId}?edit`)
        } catch (err) {
            this.setGlobal({ isCreatingNewFile: false })
            console.log(err)
        }
    }

    render() {
        return <SidebarRenderer onClickNewButton={this.onClickNewButton} />
    }
}

export default withRouter(Sidebar)

Sidebar.propTypes = {
    goToNewFile: PropTypes.bool.isRequired,
    setGoToNewFile: PropTypes.func.isRequired,
}
