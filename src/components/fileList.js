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
            <div className="filelist">
                <h1>Your work</h1>
                <div className="filelist-tagline">Last edited</div>
                <ul className="filelist-list">
                    {this.state.files.map(file => {
                        const filename = file.name.substr(0, file.name.length - 3);
                        const ext = file.name.substr(file.name.length - 3);
                        if (ext === '.md') {
                            return (
                                <li key={file.id}>
                                    <Link
                                        to={`/page/${file.id}`}
                                    >
                                        <img src="https://drive-thirdparty.googleusercontent.com/32/type/text/markdown" /> <span>{filename}</span>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
                    <style jsx>{`
                        .filelist h1 {
                            border-bottom: 1px solid var(--border-color);
                            font-size: 1.5rem;
                            font-weight: 400;
                            margin: 0;
                            padding: 1rem .5rem;
                        }
                        .filelist-list {
                            list-style-type: none;
                            padding-inline-start: unset;
                        }
                        .filelist-tagline {
                            margin-top: 1rem;
                            font-weight: 600;
                        }
                        .filelist-list a {
                            border-radius: var(--border-radius)
                            color: var(--link-color);
                            display: block;
                            font-size: 1rem;
                            padding: .5rem 1rem;
                        }
                        .filelist-list a:hover {
                            background-color: var(--hover-bg-color);
                            text-decoration: none;
                        }
                        .filelist-list a img {
                            height: 1rem;
                            width: 1rem;
                            padding-right: 1rem;
                        }
                        .filelist-list a img, .filelist-list a span {
                            display: inline-block;
                            vertical-align: middle;
                        }
                    `}</style>
            </div>
        );
    }
}

function defaultMessage() {
    return `# Welcome to Awiki`;
}
