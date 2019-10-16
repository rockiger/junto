import React from 'reactn'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import { getPageId, getParentFolderId, isPage } from './Sidebar-helper'
import {
    createFile,
    getFolderId,
    updateFile,
    createNewWiki,
} from '../../lib/gdrive'
import { UNTITLEDFILE, EMPTYVALUE } from '../../lib/constants'
import { getTitleFromFileName } from '../../lib/helper'
import SidebarRenderer from './Sidebar-component'

class Sidebar extends React.Component {
    state = {
        newFileId: '',
    }

    onClickNewButton = async ev => {
        let parentFolderIdOfNewFile
        console.log(isPage(this.props.location))
        if (isPage(this.props.location)) {
            const pageId = getPageId(this.props.location)
            try {
                parentFolderIdOfNewFile = await getFolderId(pageId)
                if (!parentFolderIdOfNewFile) {
                    const parentFolderId = getParentFolderId(
                        pageId,
                        this.global.files
                    )
                    parentFolderIdOfNewFile = await createNewWiki(
                        pageId,
                        parentFolderId
                    )
                }
            } catch (err) {
                console.log(err)
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

            this.setState({ newFileId }, () => {
                this.setGlobal({ goToNewFile: true, searchTerm: '' })
            })
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <SidebarRenderer
                newFileId={this.state.newFileId}
                goToNewFile={this.global.goToNewFile}
                onClickNewButton={this.onClickNewButton}
            />
        )
    }
}

export default withRouter(Sidebar)

Sidebar.propTypes = {
    goToNewFile: PropTypes.bool.isRequired,
    setGoToNewFile: PropTypes.func.isRequired,
}
