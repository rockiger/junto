import React from 'react'

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
import { StateContext } from '../state'

export default class FileList extends React.Component {
    static contextType = StateContext

    componentDidMount() {
        const [{ isFileListLoading }, dispatch] = this.context
        if (!isFileListLoading) {
            dispatch({ type: 'FILELIST_LOADING' })
            this.listFiles()
        }
    }

    componentDidUpdate() {
        const [
            { isFileListLoading, oldSearchTerm, searchTerm },
            dispatch,
        ] = this.context
        console.log(
            'componentDidUpdate:',
            isFileListLoading,
            oldSearchTerm,
            searchTerm
        )
        if (!isFileListLoading && oldSearchTerm !== searchTerm) {
            dispatch({ type: 'FILELIST_LOADING' })
            this.listFiles()
        }
    }

    listFiles = async () => {
        const [{ searchTerm }, dispatch] = this.context
        const folderId = await getFolderId()
        console.log('searchTerm: ', searchTerm)
        if (folderId) {
            try {
                const files = await listFiles(searchTerm)
                console.log('listFiles:', files)
                this.setState(
                    { isLoading: false },
                    dispatch({
                        type: 'SET_FILES',
                        payload: {
                            files,
                            oldSearchTerm: searchTerm,
                        },
                    })
                )
            } catch (err) {
                if (err.message === 'Invalid Credentials') {
                    try {
                        refreshSession()
                    } catch (err) {
                        alert(`Couldn't load files`)
                    }
                } else {
                    alert(`Couldn't load files`)
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
        const [{ files, isFileListLoading }] = this.context
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}

function defaultMessage() {
    return '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"My first ","marks":[]},{"object":"inline","type":"link","data":{"href":"http://rockiger.com"},"nodes":[{"object":"text","text":"paragraph","marks":[]}]},{"object":"text","text":"!","marks":[]}]}]}}'
}
