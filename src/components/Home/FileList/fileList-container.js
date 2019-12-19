// @ts-check
import React from 'reactn'
import { PageView } from 'components/Tracking'

import FileListComponent from './fileList-component'

/** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime' | 'sharedWithMeTime'}} SortBy */

// @ts-ignore
export default class FileList extends React.Component {
    componentDidMount() {
        PageView()
    }

    render() {
        // @ts-ignore
        const { isFileListLoading, searchTerm } = this.global
        // @ts-ignore
        const { emptyMessage, files, sortBy, setSortBy, title } = this.props
        return (
            <FileListComponent
                emptyMessage={
                    searchTerm
                        ? 'None of your files matched this search.'
                        : emptyMessage
                }
                files={files}
                isLoading={isFileListLoading}
                searchTerm={searchTerm}
                setSortBy={setSortBy}
                sortBy={sortBy}
                title={title}
            />
        )
    }
}
