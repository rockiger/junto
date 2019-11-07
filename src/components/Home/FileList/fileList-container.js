// @ts-check
import React from 'reactn'
import { PageView } from 'components/Tracking'

import FileListComponent from './fileList-component'

// @ts-ignore
export default class FileList extends React.Component {
    /** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime'}} SortBy */

    /** @type {SortBy} */
    state = { sortBy: 'modifiedByMeTime' }
    componentDidMount() {
        PageView()
    }

    /**
     * @param {SortBy} sortBy
     * @returns {void}
     */
    setSortBy = sortBy => {
        console.log({ sortBy })
        this.setState({ sortBy })
    }

    render() {
        // @ts-ignore
        const { files, isFileListLoading, searchTerm } = this.global
        return (
            <FileListComponent
                files={files}
                isLoading={isFileListLoading}
                searchTerm={searchTerm}
                setSortBy={this.setSortBy}
                sortBy={this.state.sortBy}
            />
        )
    }
}
