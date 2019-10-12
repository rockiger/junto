import React from 'reactn'

import {
    listFiles,
    createFile,
    updateFile,
    getFolderId,
    createNewWiki,
    refreshSession,
} from '../lib/gdrive'
import FileListRenderer from './fileListRenderer'
import { EXT } from '../lib/constants'

export default class FileList extends React.Component {
    componentDidMount() {
        const { isFileListLoading } = this.global
        if (!isFileListLoading) {
            this.setGlobal({ isFileListLoading: true })
            this.listFiles()
        }
    }

    componentDidUpdate() {
        const { isFileListLoading, oldSearchTerm, searchTerm } = this.global
        console.log(
            'componentDidUpdate:',
            isFileListLoading,
            oldSearchTerm,
            searchTerm
        )
        if (!isFileListLoading && oldSearchTerm !== searchTerm) {
            this.setGlobal({ isFileListLoading: true })
            this.listFiles()
        }
    }

    listFiles = async () => {
        const { searchTerm } = this.global
        const folderId = await getFolderId()
        console.log('searchTerm: ', searchTerm)
        if (folderId) {
            try {
                const files = await listFiles(searchTerm)
                console.log('listFiles:', files)
                this.setState({ isLoading: false })
                this.setGlobal({
                    files,
                    isFileListLoading: false,
                    oldSearchTerm: searchTerm,
                })
            } catch (err) {
                const body = JSON.parse(err.body)
                const { error } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        this.listFiles()
                    } catch (err) {
                        alert(`Couldn't refresh session: ${err.message}`)
                        console.log({ err })
                    }
                } else {
                    alert(`Couldn't load files ${err}`)
                    console.log({ error })
                }
            }
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
        const { files, isFileListLoading, searchTerm } = this.global
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}

function defaultMessage() {
    return '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"My first ","marks":[]},{"object":"inline","type":"link","data":{"href":"http://rockiger.com"},"nodes":[{"object":"text","text":"paragraph","marks":[]}]},{"object":"text","text":"!","marks":[]}]}]}}'
}
