import React from 'reactn'
import { PageView } from 'components/Tracking'

import FileListRenderer from './fileList-component'

export default class FileList extends React.Component {
    componentDidMount() {
        PageView()
    }
    render() {
        const { files, isFileListLoading } = this.global
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}
