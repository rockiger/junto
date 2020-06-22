// @ts-check
import React, { useEffect, useGlobal } from 'reactn'
import { PageView } from 'components/Tracking'

import FileListComponent from './fileList-component'

export { FileList }
export default FileList

/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

/**
 * @typedef FileListProps
 * @property {string} [emptyMessage]
 * @property {import('reactn/default').IFile[]} files
 * @property {SortBy} [sortBy]
 * @property {()=>{}} [setSortBy]
 * @property {string} [title]
 */

/**
 * @param {FileListProps} props
 */
function FileList({ emptyMessage, files, sortBy, setSortBy, title }) {
    const [isFileListLoading] = useGlobal('isFileListLoading')
    const [searchTerm] = useGlobal('searchTerm')

    useEffect(() => PageView(), [])

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
