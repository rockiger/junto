import React from 'react'

import {
    listFiles,
    createFile,
    updateFile,
    getFolderId,
    createNewWiki,
} from '../lib/gdrive'
import FileListRenderer from './fileListRenderer'
import { EXT } from '../lib/constants'

export default class FileList extends React.Component {
    state = {
        files: [],
        isLoading: true,
    }

    async componentDidMount() {
        this.listFiles()
        console.log('componentDidMount:')
    }

    listFiles = async () => {
        const folderId = await getFolderId()
        console.log('FolderId: ', folderId)
        if (folderId) {
            const files = await listFiles()
            console.log('listFiles:', files)
            this.setState({ files, isLoading: false })
        } else {
            const newFolderId = await createNewWiki()
            const newFileId = await createFile(`Home${EXT}`, newFolderId)
            await updateFile(newFileId, defaultMessage())
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newFolderId)
            this.listFiles()
        }
    }

    render() {
        return (
            <FileListRenderer
                isLoading={this.state.isLoading}
                files={this.state.files}
            />
        )
    }
}

function defaultMessage() {
    return '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"My first ","marks":[]},{"object":"inline","type":"link","data":{"href":"http://rockiger.com"},"nodes":[{"object":"text","text":"paragraph","marks":[]}]},{"object":"text","text":"!","marks":[]}]}]}}'
}
