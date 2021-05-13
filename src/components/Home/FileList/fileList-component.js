// @ts-check

import React, { useDispatch } from 'reactn'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import SortAlphabeticalIcon from 'mdi-react/SortAlphabeticalVariantIcon'

import { Spacer, Spinner } from 'components/gsuite-components'
import { EXT } from 'lib/constants'
import { getTitleFromFile, sortByDate } from 'lib/helper'
import { ButtonMenu } from 'components/ButtonMenu'

import s from './file-list.module.scss'
import { EmptyPlaceholder } from './EmptyPlaceHolder'

/** @typedef {import('reactn/default').IFile} File */
/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

/**
 * @typedef {object} Props
 * @prop {File[]} files
 * @prop {SortBy} sortBy
 *
 */

/**
 *
 * @param {Props} props
 */
const FileListPartial = props => {
    const { files, sortBy } = props
    const clearSearch = useDispatch('clearSearch')
    const classes = useStyles()
    return (
        <List className="filelist-list">
            {files
                .filter(file => {
                    return shouldFileDisplay(file)
                })
                .sort((file1, file2) => {
                    let result

                    if (sortBy === 'viewedByMeTime') {
                        result = sortByDate(
                            file1.viewedByMeTime,
                            file2.viewedByMeTime
                        )
                    } else {
                        result = sortByDate(
                            file1.modifiedByMeTime,
                            file2.modifiedByMeTime
                        )
                    }
                    return result
                })
                .map(file => {
                    const filename = getTitleFromFile(file)
                    return (
                        <ListItem className={classes.listitem} key={file.id}>
                            <Link
                                className={classes.link}
                                onClick={() => clearSearch()}
                                style={{ color: '#3c4043' }}
                                to={`/page/${file.id}`}
                            >
                                <ListItemIcon
                                    style={{ color: '#4285f4' }}
                                    className={classes.icon}
                                >
                                    <FileDocumentIcon />
                                </ListItemIcon>
                                <ListItemText primary={filename} />
                            </Link>
                        </ListItem>
                    )
                })}
        </List>
    )
}

const PeriodList = ({ files, headline, sortBy }) => {
    if (files.length > 0) {
        return (
            <>
                <div className={s.FileList_tagline}>{headline}</div>
                <FileListPartial files={files} sortBy={sortBy} />
            </>
        )
    } else {
        return null
    }
}

/**
 *
 * @param {{files: File[], sortBy: SortBy}} param0
 */

const Periods = ({ files, sortBy }) => {
    const createFilter = (older, younger = new Date()) => {
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

    const newTimeBorder = (daysBack = 0) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        today.setDate(today.getDate() - daysBack)
        return new Date(today.getTime())
    }

    const today = newTimeBorder()
    const todayFilter = createFilter(today)
    const todayFiles = files.filter(todayFilter)

    const yesterday = newTimeBorder(1)
    const yesterdayFilter = createFilter(yesterday, today)
    const yesterdayFiles = files.filter(yesterdayFilter)

    const lastWeek = newTimeBorder(7)
    const lastWeekFilter = createFilter(lastWeek, yesterday)
    const lastWeekFiles = files.filter(lastWeekFilter)

    const lastMonth = newTimeBorder(30)
    const lastMonthFilter = createFilter(lastMonth, lastWeek)
    const lastMonthFiles = files.filter(lastMonthFilter)

    const earlier = new Date(0) // 1970
    const earlierFilter = createFilter(earlier, lastMonth)
    const earlierFiles = files.filter(earlierFilter)

    return (
        <>
            <PeriodList files={todayFiles} headline="Today" sortBy={sortBy} />
            <PeriodList
                files={yesterdayFiles}
                headline="Yesterday"
                sortBy={sortBy}
            />
            <PeriodList
                files={lastWeekFiles}
                headline="Previous 7 Days"
                sortBy={sortBy}
            />
            <PeriodList
                files={lastMonthFiles}
                headline="Previous 30 Days"
                sortBy={sortBy}
            />
            <PeriodList
                files={earlierFiles}
                headline="Earlier"
                sortBy={sortBy}
            />
        </>
    )
}

/**
 * @typedef {object} FileListComponentProps
 * @property {MdiReactIconComponentType} [emptyIcon]
 * @prop {string} [emptyMessage]
 * @prop {string} [emptySubline]
 * @prop {File[]} files
 * @prop {boolean} [isLoading]
 * @prop {boolean} [isScrollable]
 * @prop {SortBy} sortBy
 * @prop {string} searchTerm
 * @prop {function} setSortBy
 * @prop {string} [title]
 * @prop {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [header]
 */

/**
 * @param {FileListComponentProps} props
 */
const FileListComponent = props => {
    const {
        emptyIcon,
        emptyMessage,
        emptySubline,
        files,
        header,
        searchTerm,
        setSortBy,
        sortBy,
        title,
    } = props
    console.log(header)
    const Header = header ? header : 'h1'
    if (searchTerm || title) {
        document.title = `${
            searchTerm ? 'Search Result' : title
        } – Fulcrum.wiki`
    }
    return (
        <div className="filelist">
            <div className={s.FileList_header}>
                {title && (
                    <Header className={s.FileList_header_title}>{title}</Header>
                )}
                <Spacer />
                {setSortBy && (
                    <div className={s.FileList_header_buttons}>
                        <strong
                            className={s.sortCriteria}
                            style={{ fontWeight: 500, marginRight: '.5rem' }}
                        >
                            {sortBy === 'viewedByMeTime'
                                ? 'Last opened by me'
                                : 'Last modified by me'}
                        </strong>
                        <ButtonMenu
                            items={[
                                {
                                    key: 1,
                                    name: 'Last modified by me',
                                    handler: () =>
                                        setSortBy('modifiedByMeTime'),
                                    active: sortBy === 'modifiedByMeTime',
                                },
                                {
                                    key: 2,
                                    name: 'Last opened by me',
                                    handler: () => setSortBy('viewedByMeTime'),
                                    active: sortBy === 'viewedByMeTime',
                                },
                            ]}
                            selectable={true}
                        >
                            <SortAlphabeticalIcon />
                        </ButtonMenu>
                    </div>
                )}
            </div>
            <div
                className={clsx(s.FileList_content, {
                    isScrollable: s.FileList_content__scrollable,
                })}
            >
                {/* 
                // @ts-ignore */}
                {props.isLoading && <Spinner />}
                {!props.isLoading && <Periods files={files} sortBy={sortBy} />}
                {files.length === 0 && !props.isLoading && (
                    <EmptyPlaceholder
                        icon={emptyIcon}
                        subline={emptySubline}
                        title={emptyMessage}
                    />
                )}
            </div>
            <style>{`
                    .filelist h1 {
                        border-bottom: 1px solid #dadce0;
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .5rem;
                    }
                    .filelist-list a {
                        border-radius: 66px;
                        color: #4285f4;
                        font-size: 1rem;
                        padding: .5rem 1rem .5rem .75rem;
                    }
                    .filelist-list a:hover {
                        background-color: #e8f0fe;
                        text-decoration: none;
                    }
                    .filelist-list a img, .filelist-list a span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                `}</style>
        </div>
    )
}
export default FileListComponent

function useStyles() {
    const useStyles = makeStyles(theme => {
        return {
            icon: {
                color: theme.palette.primary.main,
                minWidth: theme.spacing(4),
            },
            link: {
                display: 'flex',
                flexGrow: 1,
                textDecoration: 'none',
                alignItems: 'center',
            },
            listitem: {
                padding: 0,
                paddingRight: theme.spacing(2),
            },
        }
    })
    return useStyles()
}

/**
 * @param {File} file
 */
function shouldFileDisplay(file) {
    const { mimeType, name, trashed } = file
    return (
        mimeType === 'application/json' &&
        name.endsWith(EXT) &&
        trashed === false
    )
}
