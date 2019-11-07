// @ts-check
import React from 'reactn'
import { PageView } from 'components/Tracking'

import { LOCALSTORAGE_NAME } from 'lib/constants'

import FileListComponent from './fileList-component'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`

/** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime'}} SortBy */

// @ts-ignore
export default class FileList extends React.Component {
    constructor(props) {
        super(props)

        const sortByLS = localStorage.getItem(localStorageKey)
        const sortBy =
            sortByLS &&
            (sortByLS === 'modifiedByMeTime' || sortByLS === 'viewedByMeTime')
                ? sortByLS
                : 'modifiedByMeTime'

        /** @type {SortBy} */
        this.state = {
            sortBy,
        }
    }

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
        //@ts-ignore
        localStorage.setItem(localStorageKey, sortBy)
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
