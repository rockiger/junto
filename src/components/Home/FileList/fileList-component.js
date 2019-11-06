import React, { useGlobal } from 'reactn'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'

import Spinner from 'components/spinner'
import { EXT, MYHOME, OVERVIEW_NAME } from 'lib/constants'
import { getTitleFromFileName } from 'lib/helper'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

const FileListPartial = props => {
    const [, setSearchTerm] = useGlobal('searchTerm')
    const classes = useStyles()
    return (
        <List className="filelist-list">
            {props.files
                .filter(file => {
                    return shouldFileDisplay(file)
                })
                .map(file => {
                    const filename =
                        file.name === OVERVIEW_NAME
                            ? MYHOME
                            : getTitleFromFileName(file.name)
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

const PeriodList = ({ files, headline }) => {
    if (files.length > 0) {
        return (
            <>
                <div className="filelist-tagline">{headline}</div>
                <FileListPartial files={files} />
            </>
        )
    } else {
        return null
    }
}

const Periods = ({ files }) => {
    const createFilter = (older, younger = new Date()) => {
        return file => {
            const date = parseInt(Date.parse(file.modifiedByMeTime))
            return (
                date > parseInt(older.getTime()) &&
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

    const earlier = newTimeBorder(31)
    const earlierFilter = createFilter(earlier, lastMonth)
    const earlierFiles = files.filter(earlierFilter)

    return (
        <>
            <PeriodList files={todayFiles} headline="Today" />
            <PeriodList files={yesterdayFiles} headline="Yesterday" />
            <PeriodList files={lastWeekFiles} headline="Previous 7 Days" />
            <PeriodList files={lastMonthFiles} headline="Previous 30 Days" />
            <PeriodList files={earlierFiles} headline="Earlier" />
        </>
    )
}

const FileListRenderer = props => {
    const { searchTerm } = props
    return (
        <div className="filelist">
            <h1>{searchTerm ? 'Search Result' : 'Your Work'}</h1>
            <div className="filelist-content">
                {props.isLoading && <Spinner />}
                {!props.isLoading && <Periods files={props.files} />}
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
export default FileListRenderer

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

function shouldFileDisplay(file) {
    const { mimeType, name, trashed } = file
    return (
        mimeType === 'application/json' &&
        name.endsWith(EXT) &&
        trashed === false
    )
}
