import React from 'reactn'
import PropTypes from 'prop-types'

import { createFile, getFolderId, updateFile } from '../lib/gdrive'
import { UNTITLEDFILE, EMPTYVALUE } from '../lib/constants'
import SidebarRenderer from './sidebarRenderer'

export default class Sidebar extends React.Component {
    state = {
        newFileId: '',
    }

    onClickNewButton = async ev => {
        const parentId = await getFolderId()
        const newFileId = await createFile(UNTITLEDFILE, parentId)
        await updateFile(newFileId, JSON.stringify(EMPTYVALUE))

        this.setState({ newFileId }, () => {
            this.setGlobal({ goToNewFile: true, searchTerm: '' })
        })
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

Sidebar.propTypes = {
    goToNewFile: PropTypes.bool.isRequired,
    setGoToNewFile: PropTypes.func.isRequired,
}
