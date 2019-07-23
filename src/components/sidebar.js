import React from 'react';
import PropTypes from 'prop-types';

import { createFile, getFolderId } from '../lib/gdrive'
import { UNTITLEDFILE } from '../lib/constants';
import SidebarRenderer from './sidebarRenderer';

export default class Sidebar extends React.Component {
    state = {
        fileId: '',
    };

    onClickNewButton = async ev => {
        const parentId = await getFolderId();
        const fileId = await createFile(UNTITLEDFILE, parentId);
        
        this.setState({
            fileId,
        })
        console.log('ButtonState', this.state);
        
        this.props.setGoToNewFile(true);
    };

    componentWillUnmount() {
        console.log('Sidebar will unmount');
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