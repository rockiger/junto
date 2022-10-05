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

    const sorter = useMemo(() => createSorter(sortBy), [sortBy])
    const sortedFiles = useMemo(() => files.sort(sorter), [files, sorter])

    const today = useMemo(() => newTimeBorder(), [])
    const todayFilter = useMemo(() => createFilter(today), [today])
    const todayFiles = useMemo(() => sortedFiles.filter(todayFilter), [
        sortedFiles,
        todayFilter,
    ])

    const yesterday = useMemo(() => newTimeBorder(1), [])
    const yesterdayFilter = useMemo(() => createFilter(yesterday, today), [
        yesterday,
        today,
    ])
    const yesterdayFiles = useMemo(() => sortedFiles.filter(yesterdayFilter), [
        sortedFiles,
        yesterdayFilter,
    ])

    const lastWeek = useMemo(() => newTimeBorder(7), [])
    const lastWeekFilter = useMemo(() => createFilter(lastWeek, yesterday), [
        lastWeek,
        yesterday,
    ])
    const lastWeekFiles = useMemo(() => sortedFiles.filter(lastWeekFilter), [
        sortedFiles,
        lastWeekFilter,
    ])

    const lastMonth = useMemo(() => newTimeBorder(30), [])
    const lastMonthFilter = useMemo(() => createFilter(lastMonth, lastWeek), [
        lastMonth,
        lastWeek,
    ])
    const lastMonthFiles = useMemo(() => sortedFiles.filter(lastMonthFilter), [
        sortedFiles,
        lastMonthFilter,
    ])

    const earlier = useMemo(() => new Date(0), []) // 1970
    const earlierFilter = useMemo(() => createFilter(earlier, lastMonth), [
        earlier,
        lastMonth,
    ])
    const earlierFiles = useMemo(() => sortedFiles.filter(earlierFilter), [
        sortedFiles,
        earlierFilter,
    ])

    return (
        <FileListComponent
            emptyIcon={emptyIcon}
            emptyMessage={
                searchTerm
                    ? 'None of your files matched this search.'
                    : emptyMessage
            }
            emptySubline={emptySubline}
            filePeriods={{
                todayFiles,
                yesterdayFiles,
                lastWeekFiles,
                lastMonthFiles,
                earlierFiles,
            }}
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
