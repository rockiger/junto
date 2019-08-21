import React from 'react'
import PropTypes from 'prop-types'

import { createFile, getFolderId, updateFile } from '../lib/gdrive'
import { UNTITLEDFILE, EMPTYVALUE } from '../lib/constants'
import SidebarRenderer from './sidebarRenderer'
import { StateContext } from '../state'

export default class Sidebar extends React.Component {
    static contextType = StateContext

    state = {
        fileId: '',
    }

    onClickNewButton = async ev => {
        const [{ searchTerm }, dispatch] = this.context
        const parentId = await getFolderId()
        const fileId = await createFile(UNTITLEDFILE, parentId)
        await updateFile(fileId, JSON.stringify(EMPTYVALUE))

        this.setState({ fileId }, () => {
            dispatch({
                type: 'SET_SEARCHTERM',
                payload: {
                    searchTerm: '',
                },
            })
            this.props.setGoToNewFile(true)
        })
    }

    render() {
        return (
            <SidebarRenderer
                fileId={this.state.fileId}
                goToNewFile={this.props.goToNewFile}
                onClickNewButton={this.onClickNewButton}
            />
        )
    }
}

Sidebar.propTypes = {
    goToNewFile: PropTypes.bool.isRequired,
    setGoToNewFile: PropTypes.func.isRequired,
}
