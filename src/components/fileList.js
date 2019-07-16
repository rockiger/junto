import React from 'react';
import { Link } from 'react-router-dom';


import Spinner from './spinner'
import { listFiles, createFile, updateFile, getFolderId, createNewWiki } from '../lib/gdrive';
import { EXT } from '../lib/constants';
import { getTitleFromFileName, getExtFromFilenName } from '../lib/helper';

export default class FileList extends React.Component {
    
    state = {
        files: [],
        isLoading: true
    }

    async componentDidMount() {
        this.listFiles();
        console.log('componentDidMount:');
    }

    listFiles = async () => {
        const folderId = await getFolderId();
        console.log('FolderId: ', folderId);
        if (folderId) {
            const files = await listFiles();
            console.log('listFiles:', files)
            this.setState({ files, isLoading: false });
        } else {
            const newFolderId = await createNewWiki();
            const newFileId = await createFile(`Home${EXT}`, newFolderId);
            await updateFile(newFileId, defaultMessage());
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newFolderId);
            this.listFiles();
        }
    }

    render() {
        return (
            <div className="filelist">
                <h1>Your work</h1>
                <div className="filelist-tagline">Last edited</div>
                {this.state.isLoading && <Spinner />}
                {!this.state.isLoading && <ul className="filelist-list">
                    {this.state.files
                        .filter(file => {
                            console.log('file.name:', file.name)
                            const ext = getExtFromFilenName(file.name);
                            console.log('ext:', ext);
                            
                            return (ext === EXT)
                        })
                        .map(file => {
                            const filename = getTitleFromFileName(file.name);
                            return (
                                <li key={file.id}>
                                    <Link
                                        to={`/page/${file.id}`}
                                    >
                                        <img src="https://drive-thirdparty.googleusercontent.com/32/type/text/markdown" alt="Markdown file" /> <span>{filename}</span>
                                    </Link>
                                </li>
                            );
                        })}
                </ul>}
                <style>{`
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
                            border-radius: var(--border-radius);
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
    return `<h1>Welcome to Awiki</h1>`;
}
