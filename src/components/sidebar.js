import React from 'react';
import { Redirect, Router } from 'react-router-dom'

export default class Sidebar extends React.Component {
    state = {
        fileId: '',
    };

    onClickNewButton = async ev => {
        const parentId = await getFolderId();
        const fileId = await createFile('Untitled page.md', parentId);
        
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
        if (this.props.goToNewFile && this.state.fileId ) {
            return <Redirect to={`/page/${this.state.fileId}`} />
        }

        return (
            <div className="Sidebar">
                <div
                    className="Sidebar-newButton"
                    onClick={this.onClickNewButton}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                    </svg>
                    <span>New Page</span>
                </div>
                <style jsx>{`
                    .Sidebar-newButton {
                        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
                            0 1px 3px 1px rgba(60, 64, 67, 0.149);
                        align-items: center;
                        background-color: #fff;
                        background-image: none;
                        border: 1px solid transparent;
                        border-radius: 24px;
                        color: #3c4043;
                        display: inline-flex;
                        font-size: 14px;
                        font-weight: 600;
                        height: 48px;
                        letter-spacing: 0.15px;
                        line-height: 22px;
                        margin: 0 0 0 -5px;
                        min-width: 120px;
                        padding: 0 10px 0 15px;
                        text-transform: none;
                        width: inherit;
                        cursor: pointer;
                    }
                    .Sidebar-newButton:hover {
                        box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.302),
                            0 4px 8px 3px rgba(60, 64, 67, 0.149);
                        background-color: #f8f9fa;
                        outline: none;
                    }
                    .Sidebar svg {
                        fill: #3d5afe;
                    }
                    .Sidebar span {
                        margin-left: 15px;
                    }
                `}</style>
            </div>
        );
    }
}

async function getFolderId() {
    // duplicate of method in fileList.js
    try {
        const result = await window.gapi.client.drive.files.list({
            q: 'name="Awiki Documents"',
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
        console.log(result);
        const resultBody = JSON.parse(result.body);
        if (resultBody.files.length > 0) return resultBody.files[0].id;
    } catch (err) {
        console.log(err);
    }
}

async function createFile(name, parentId) {
    // duplicate of method in fileList.js
    const fileMetadata = {
        name: name,
        mimeType: 'text/markdown',
        parents: [parentId],
    };
    try {
        const response = await window.gapi.client.drive.files.create({
            resource: fileMetadata,
        });
        console.log(response);

        return response.result.id;
    } catch (err) {
        console.log(err);
    }
}
