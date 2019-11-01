import React from 'reactn'
import { PageView } from './Tracking'

import FileListRenderer from './fileListRenderer'

export default class FileList extends React.Component {
    componentDidMount() {
        PageView()
    }
    render() {
        const { files, isFileListLoading } = this.global
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}
