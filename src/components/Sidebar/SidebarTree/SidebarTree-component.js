import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import { EXT, OVERVIEW_NAME } from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'

const useStyles = makeStyles(theme => {
    return {
        ul: {
            listStyleType: 'none',
            paddingLeft: 0,
        },
        group: {
            marginLeft: 0,
        },
        icon: {
            color: theme.palette.primary.main,
            minWidth: theme.spacing(4),
        },
        link: {
            '&:hover': {
                backgroundColor: 'var(--hover-bg-color)',
            },
            display: 'flex',
            flexGrow: 1,
            textDecoration: 'none',
            alignItems: 'center',
            borderRadius: 'var(--border-radius)',
            color: 'var(--link-color)',
            fontSize: '1rem',
            padding: '.25rem',
            width: 210,
            height: '2rem',
            overflow: 'hidden',
            lineHeight: '1rem',
        },
    }
})

export const SidebarTreeItem = props => {
    const classes = useStyles()
    const { nodeId, files, label, level, parentId } = props
    return (
        <li key={nodeId}>
            <Link
                className={classes.link}
                to={`/page/${nodeId}`}
                style={{ paddingLeft: level * 16 }}
            >
                {parentId ? <MenuDownIcon /> : <CircleSmallIcon />}
                <div
                    style={{
                        lineHeight: 1.5,
                        maxWidth: 'calc(100% - 24px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {label}
                </div>
                {/*<button>+</button>*/}
            </Link>
            {files && (
                <ul className={classes.ul}>
                    {files.map(file => {
                        const folderId = getFolderId(file.id, files)
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItemWithRouter
                                    files={filterChildFiles(folderId, files)}
                                    label={getTitleFromFileName(file.name)}
                                    level={level + 1}
                                    nodeId={file.id}
                                    parentId={folderId}
                                />
                            )
                        }
                    })}
                </ul>
            )}
        </li>
    )
}

const SidebarTreeItemWithRouter = withRouter(SidebarTreeItem)

export const SidebarTreeComponent = ({ rootFolderId, files }) => {
    return (
        <ul
            style={{
                height: 'calc(100vh - 138px)',
                listStyleType: 'none',
                marginRight: '.5rem',
                overflowY: 'auto',
                paddingLeft: 0,
            }}
        >
            <SidebarTreeItemWithRouter
                files={files}
                label="My Fulcrum"
                level={0}
                nodeId={getOverviewFileId(files)}
                parentId={rootFolderId}
            />
        </ul>
    )
}

function getFolderId(fileId, files) {
    const folder = files.find(file => file.name === fileId)
    return folder ? folder.id : null
}

function getOverviewFileId(files) {
    const overview = files.find(file => file.name === OVERVIEW_NAME)
    if (overview) return overview.id
    return ''
}
function filterChildFiles(folderId, files) {
    if (folderId) return files.filter(file => file.parents.includes(folderId))
    return []
}

function shouldFileDisplay(file, parentId) {
    const { mimeType, name, parents, trashed } = file
    return (
        mimeType === 'application/json' &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents.includes(parentId) &&
        trashed === false
    )
}
