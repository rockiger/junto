// @ts-check

import React, { useGlobal } from 'reactn'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import SortAlphabeticalIcon from 'mdi-react/SortAlphabeticalIcon'

import Spinner from 'components/spinner'
import { EXT } from 'lib/constants'
import { getTitleFromFile, sortByDate } from 'lib/helper'
import { PageButtons } from 'components/pageButtons'
import { ButtonMenu } from 'components/ButtonMenu'

/** @typedef {{id: string, mimeType: string, name: string, modifiedByMeTime: string, trashed: boolean, viewedByMeTime: string}} File */
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
    // @ts-ignore
    const [, setSearchTerm] = useGlobal('searchTerm')
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
                                onClick={() => setSearchTerm('')}
                                to={`/page/${file.id}`}
                            >
                                <ListItemIcon className={classes.icon}>
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
                <div className="filelist-tagline">{headline}</div>
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
 * @prop {string} [emptyMessage]
 * @prop {File[]} files
 * @prop {boolean} isLoading
 * @prop {SortBy} sortBy
 * @prop {string} searchTerm
 * @prop {function} setSortBy
 * @prop {string} title
 */

/**
 *
 * @param {FileListComponentProps} props
 */
const FileListComponent = props => {
    const { emptyMessage, files, searchTerm, setSortBy, sortBy, title } = props
    return (
        <div className="filelist">
            {setSortBy && (
                <PageButtons>
                    <strong style={{ fontWeight: 500, marginRight: '.5rem' }}>
                        {sortBy === 'viewedByMeTime'
                            ? 'Last opened by me'
                            : 'Last modified by me'}
                    </strong>
                    <ButtonMenu
                        items={[
                            {
                                key: 1,
                                name: 'Last modified by me',
                                handler: () => setSortBy('modifiedByMeTime'),
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
                </PageButtons>
            )}
            <h1>{searchTerm ? 'Search Result' : title}</h1>
            <div className="filelist-content">
                {/* 
                // @ts-ignore */}
                {props.isLoading && <Spinner />}
                {!props.isLoading && <Periods files={files} sortBy={sortBy} />}
                {files.length === 0 && <h2>{emptyMessage}</h2>}
            </div>
            <style>{`
                    .filelist h1 {
                        border-bottom: 1px solid var(--border-color);
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .5rem;
                    }
                    .filelist-content {
                        overflow-y: auto;
                        height: calc((100vh - 65px) - 56px);
                    }
                    .filelist-tagline {
                        margin-top: 1rem;
                        font-weight: 500;
                        font-size: 1rem;
                    }
                    .filelist-list a {
                        border-radius: var(--border-radius);
                        color: var(--link-color);
                        font-size: 1rem;
                        padding: .5rem 1rem .5rem .75rem;
                    }
                    .filelist-list a:hover {
                        background-color: var(--hover-bg-color);
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
 * @param {{mimeType: string, name: string, trashed: boolean}} file
 */
function shouldFileDisplay(file) {
    const { mimeType, name, trashed } = file
    return (
        mimeType === 'application/json' &&
        name.endsWith(EXT) &&
        trashed === false
    )
}
