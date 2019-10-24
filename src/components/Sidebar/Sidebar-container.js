import React from 'reactn'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import {
    getIdByName,
    getPageId,
    getParentFolderId,
    isPage,
} from './Sidebar-helper'
import { createFile, updateFile, createNewWiki } from '../../lib/gdrive'
import { UNTITLEDFILE, EMPTYVALUE } from '../../lib/constants'
import SidebarRenderer from './Sidebar-component'

class Sidebar extends React.Component {
    onClickNewButton = async ev => {
        this.setGlobal({ isCreatingNewFile: true })
        let parentFolderIdOfNewFile
        console.log(isPage(this.props.location))
        if (isPage(this.props.location)) {
            const pageId = getPageId(this.props.location)
            parentFolderIdOfNewFile = getIdByName(
                pageId,
                this.global.initialFiles
            )
            if (!parentFolderIdOfNewFile) {
                const parentFolderId = getParentFolderId(
                    pageId,
                    this.global.initialFiles
                )
                try {
                    parentFolderIdOfNewFile = await createNewWiki(
                        pageId,
                        parentFolderId
                    )
                } catch (err) {
                    this.setGlobal({ isCreatingNewFile: false })
                    console.log(err)
                }
            }
        } else {
            parentFolderIdOfNewFile = this.global.rootFolderId
        }

        try {
            console.log(parentFolderIdOfNewFile)
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile
            )
            const result = await updateFile(
                newFileId,
                JSON.stringify(EMPTYVALUE)
            )

            console.log(result)

            this.setGlobal({
                backgroundUpdate: true,
                goToNewFile: true,
                searchTerm: '',
                isCreatingNewFile: false,
            })
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
