import React from 'react';
import { Link } from 'react-router-dom';

import { listFiles, createFile, updateFile } from '../lib/gdrive';

export default class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    async componentDidMount() {
        this.listFiles();
        console.log('componentDidMount:');
    }

    async listFiles() {
        const folderId = await this.getFolderId();
        console.log('FolderId: ', folderId);
        if (folderId) {
            const files = await listFiles();
            this.setState({ files });
        } else {
            const newFolderId = await this.createNewWiki();
            const newFileId = await this.createFile('Home.md', newFolderId);
            const newFileDesc = await updateFile(newFileId, defaultMessage());
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newFolderId);
            this.listFiles();
        }
    }

    async getFolderId() {
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

    async createFile(name, parentId) {
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

    async createNewWiki() {
        const name = 'Awiki Documents';
        const fileMetadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
        };
        try {
            const result = await window.gapi.client.drive.files.create({
                resource: fileMetadata,
            });
            console.log(result);

            return JSON.parse(result.body).id;
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <h2>Files:</h2>
                <ul>
                    {this.state.files.map(file => {
                        const filename = file.name.substr(0, file.name.length - 3);
                        const ext = file.name.substr(file.name.length - 3);
                        if (ext === '.md') {
                            return (
                                <li key={file.id}>
                                    <Link
                                        to={`/page/${file.id}`}
                                    >
                                        {filename}
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        );
    }
}

function defaultMessage() {
    return `# Welcome to Awiki`;
}
