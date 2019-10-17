import React, { useGlobal } from 'reactn'
import { Link, withRouter } from 'react-router-dom'
import { IconButton, Tooltip } from '@material-ui/core'

import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import MenuRightIcon from 'mdi-react/MenuRightIcon'

import { useStyles } from './SidebarTree-styles'
import { getPageId, isPage } from '../Sidebar-helper'
import Spinner from '../../spinner'
import { EXT, OVERVIEW_NAME } from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'
import { useState } from 'react'

export const SidebarTreeItem = props => {
    const {
        expand = false,
        files,
        label,
        level,
        location,
        nodeId,
        parentId,
    } = props
    const [isExpanded, setExpanded] = useState(expand)
    const classes = useStyles()
    const currentPageId = isPage(location) ? getPageId(location) : null

    function onClickTreeButton(ev) {
        ev.preventDefault()
        setExpanded(!isExpanded)
    }
    return (
        <li>
            <Tooltip title={label} enterDelay={500} leaveDelay={200}>
                <Link
                    className={classes.link}
                    to={`/page/${nodeId}`}
                    style={{
                        color:
                            currentPageId === nodeId
                                ? 'var(--primary-color)'
                                : '',
                        paddingLeft: level * 16,
                    }}
                >
                    {parentId ? (
                        <IconButton
                            aria-label="open"
                            onClick={onClickTreeButton}
                            size="small"
                            style={{
                                color:
                                    currentPageId === nodeId
                                        ? 'var(--primary-color)'
                                        : '',
                                margin: '0 3px',
                                padding: 0,
                            }}
                        >
                            {isExpanded ? <MenuDownIcon /> : <MenuRightIcon />}
                        </IconButton>
                    ) : (
                        <CircleSmallIcon style={{ margin: '0 3px' }} />
                    )}
                    <div
                        style={{
                            lineHeight: 1.5,
                            maxWidth: 'calc(100% - 30px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </div>
                    {/*<button>+</button>*/}
                </Link>
            </Tooltip>
            {isExpanded && files && (
                <ul className={classes.ul}>
                    {files.map(file => {
                        const folderId = getFolderId(file.id, files)
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItemWithRouter
                                    files={filterChildFiles(folderId, files)}
                                    key={file.id}
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
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const classes = useStyles()
    return (
        <>
            {isInitialFileListLoading && (
                <Spinner style={{ marginTop: '2rem' }} />
            )}
            {!isInitialFileListLoading && (
                <ul className={classes.mydrive}>
                    <SidebarTreeItemWithRouter
                        expand={true}
                        files={files}
                        label="My Fulcrum"
                        level={0}
                        nodeId={getOverviewFileId(files)}
                        parentId={rootFolderId}
                    />
                </ul>
            )}
        </>
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
