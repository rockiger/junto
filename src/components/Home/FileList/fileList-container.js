// @ts-check
import React, { useEffect, useGlobal } from 'reactn'
import { PageView } from 'components/Tracking'

import FileListComponent from './fileList-component'

export { FileList }
export default FileList

/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

/**
 * @typedef FileListProps
 * @property {MdiReactIconComponentType} [emptyIcon]
 * @property {string} [emptyMessage]
 * @property {string} [emptySubline]
 * @property {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [header]
 * @property {boolean} [isLoading]
 * @property {boolean} [isScrollable]
 * @property {import('reactn/default').IFile[]} files
 * @property {SortBy} [sortBy]
 * @property {()=>{}} [setSortBy]
 * @property {string} [title]
 */

/**
 * @param {FileListProps} props
 */
function FileList({
    emptyIcon,
    emptyMessage,
    emptySubline,
    files,
    header,
    sortBy,
    setSortBy,
    title,
}) {
    const [isFileListLoading] = useGlobal('isFileListLoading')
    const [searchTerm] = useGlobal('searchTerm')

    useEffect(() => PageView(), [])

    return (
        <FileListComponent
            emptyIcon={emptyIcon}
            emptyMessage={
                searchTerm
                    ? 'None of your files matched this search.'
                    : emptyMessage
            }
            emptySubline={emptySubline}
            files={files}
            header={header}
            isLoading={_.isEmpty(files) && isFileListLoading}
            searchTerm={searchTerm}
            setSortBy={setSortBy}
            sortBy={sortBy}
            title={title}
        />
    )
}
