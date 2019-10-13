import React from 'reactn'

import FileListRenderer from './fileListRenderer'

export default class FileList extends React.Component {
    render() {
        const { files, isFileListLoading } = this.global
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}
