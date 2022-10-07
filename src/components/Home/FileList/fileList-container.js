// @ts-check
import React, { useEffect, useGlobal, useMemo } from 'reactn'
import { PageView } from 'components/Tracking'

import FileListComponent from './fileList-component'
import { sortByDate } from 'lib/helper'

export { FileList }
export default FileList

/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

/**
 * @typedef FileListProps
 * @property {any} [emptyIcon]
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

    const filePeriods = useMemo(() => {
        console.log('filePeriods', files, sortBy)
        if (_.isEmpty(files)) {
            return {
                todayFiles: [],
                yesterdayFiles: [],
                lastWeekFiles: [],
                lastMonthFiles: [],
                earlierFiles: [],
            }
        }
        const sorter = createSorter(sortBy)
        const sortedFiles = files.sort(sorter)
        const today = newTimeBorder()
        const todayFilter = createFilter(today)
        const todayFiles = sortedFiles.filter(todayFilter)

        const yesterday = newTimeBorder(1)
        const yesterdayFilter = createFilter(yesterday, today)
        const yesterdayFiles = sortedFiles.filter(yesterdayFilter)

        const lastWeek = newTimeBorder(7)
        const lastWeekFilter = createFilter(lastWeek, yesterday)
        const lastWeekFiles = sortedFiles.filter(lastWeekFilter)

        const lastMonth = newTimeBorder(30)
        const lastMonthFilter = createFilter(lastMonth, lastWeek)
        const lastMonthFiles = sortedFiles.filter(lastMonthFilter)

        const earlier = new Date(0) // 1970
        const earlierFilter = createFilter(earlier, lastMonth)
        const earlierFiles = sortedFiles.filter(earlierFilter)
        return {
            todayFiles,
            yesterdayFiles,
            lastWeekFiles,
            lastMonthFiles,
            earlierFiles,
        }
    }, [files, sortBy])

    return (
        <FileListComponent
            emptyIcon={emptyIcon}
            emptyMessage={
                searchTerm
                    ? 'None of your files matched this search.'
                    : emptyMessage
            }
            emptySubline={emptySubline}
            filePeriods={filePeriods}
            header={header}
            isLoading={_.isEmpty(files) && isFileListLoading}
            searchTerm={searchTerm}
            setSortBy={setSortBy}
            //@ts-ignore
            sortBy={sortBy}
            title={title}
        />
    )
}

function createFilter(older, younger = new Date(), sortBy = 'modified') {
    return file => {
        // @ts-ignore
        const date = parseInt(Date.parse(file[sortBy]))

        return (
            date > parseInt(older.getTime()) &&
            // @ts-ignore
            date < parseInt(younger.getTime())
        )
    }
}

function newTimeBorder(daysBack = 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    today.setDate(today.getDate() - daysBack)
    return new Date(today.getTime())
}

function createSorter(sortBy = 'modified') {
    return (file1, file2) => {
        return sortByDate(file1[sortBy], file2[sortBy])
    }
}
