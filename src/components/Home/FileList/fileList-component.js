// @ts-check

import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import SortAlphabeticalIcon from 'mdi-react/SortAlphabeticalVariantIcon'
import StarIcon from 'mdi-react/StarIcon'

import { Spacer, Spinner } from 'components/gsuite-components'
import { getTitleFromFile } from 'lib/helper'
import { ButtonMenu } from 'components/ButtonMenu'
import { isArchived } from 'lib/helper'

import s from './file-list.module.scss'
import { EmptyPlaceholder } from './EmptyPlaceHolder'

/** @typedef {import('reactn/default').IFile} File */
/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime' | 'modified' } SortBy */

/**
 * @typedef {object} Props
 * @prop {any} classes
 * @prop {File[]} files
 *
 */

/**
 *
 * @param {Props} props
 */
const FileListPartial = props => {
    const { files, classes } = props
    const clearSearch = () => {} //! useDispatch('clearSearch')
    return (
        <List className="filelist-list">
            {files.map(file => {
                const filename = getTitleFromFile(file)
                //! next
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
                            <ListItemText
                                primary={
                                    <>
                                        {filename}{' '}
                                        {isArchived(file) && (
                                            <Chip
                                                label="archived"
                                                size="small"
                                            />
                                        )}
                                    </>
                                }
                            />
                            {file.isStarred && (
                                <StarIcon style={{ color: '#fbbc05' }} />
                            )}
                        </Link>
                    </ListItem>
                )
            })}
        </List>
    )
}

const PeriodList = ({ classes, files, headline }) => {
    if (files.length > 0) {
        return (
            <>
                <div className={s.FileList_tagline}>{headline}</div>
                <FileListPartial classes={classes} files={files} />
            </>
        )
    } else {
        return null
    }
}

const Periods = ({
    classes,
    filePeriods: {
        todayFiles,
        yesterdayFiles,
        lastWeekFiles,
        lastMonthFiles,
        earlierFiles,
    },
    sortBy,
}) => {
    return (
        <>
            <PeriodList classes={classes} files={todayFiles} headline="Today" />
            <PeriodList
                classes={classes}
                files={yesterdayFiles}
                headline="Yesterday"
            />
            <PeriodList
                classes={classes}
                files={lastWeekFiles}
                headline="Previous 7 Days"
            />
            <PeriodList
                classes={classes}
                files={lastMonthFiles}
                headline="Previous 30 Days"
            />
            <PeriodList
                classes={classes}
                files={earlierFiles}
                headline="Earlier"
            />
        </>
    )
}

/**
 * @typedef {object} FileListComponentProps
 * @property {any} [emptyIcon]
 * @prop {string} [emptyMessage]
 * @prop {string} [emptySubline]
 * @prop {{todayFiles: File[], yesterdayFiles: File[], lastWeekFiles: File[], lastMonthFiles: File[], earlierFiles: File[]}} filePeriods
 * @prop {boolean} [isLoading]
 * @prop {boolean} [isScrollable]
 * @prop {SortBy} sortBy
 * @prop {string} searchTerm
 * @prop {function | undefined} setSortBy
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
        filePeriods,
        header,
        searchTerm,
        setSortBy,
        sortBy,
        title,
    } = props
    const Header = header ? header : 'h1'
    if (searchTerm || title) {
        document.title = `${
            searchTerm ? 'Search Result' : title
        } – Fulcrum.wiki`
    }
    const classes = useStyles()

    return (
        <div className="filelist">
            <div className={s.FileList_header}>
                {title && (
                    <Header className={s.FileList_header_title}>{title}</Header>
                )}
                <Spacer />
                {isEmptyFilePeriods(filePeriods) && setSortBy && (
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
                {isEmptyFilePeriods(filePeriods) && !props.isLoading && (
                    <EmptyPlaceholder
                        icon={emptyIcon}
                        subline={emptySubline}
                        title={emptyMessage}
                    />
                )}
                {!props.isLoading && !isEmptyFilePeriods(filePeriods) && (
                    <Periods
                        classes={classes}
                        filePeriods={filePeriods}
                        sortBy={sortBy}
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

function isEmptyFilePeriods(filePeriods) {
    return _.every(_.values(filePeriods), _.isEmpty)
}

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
