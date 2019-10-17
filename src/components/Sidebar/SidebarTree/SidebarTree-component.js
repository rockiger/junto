import React, { useGlobal } from 'reactn'
import { Link, withRouter } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'

import MenuDownIcon from 'mdi-react/MenuDownIcon'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'

import { useStyles } from './SidebarTree-styles'
import { getPageId, isPage } from '../Sidebar-helper'
import Spinner from '../../spinner'
import { EXT, OVERVIEW_NAME } from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'

export const SidebarTreeItem = props => {
    const classes = useStyles()
    const { nodeId, files, label, level, location, parentId } = props
    const currentPageId = isPage(location) ? getPageId(location) : null
    return (
        <li key={nodeId}>
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
            </Tooltip>
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
    const [isFileListLoading] = useGlobal('isFileListLoading')
    const classes = useStyles()
    return (
        <>
            {isFileListLoading && <Spinner style={{ marginTop: '2rem' }} />}
            {!isFileListLoading && (
                <ul className={classes.mydrive}>
                    <SidebarTreeItemWithRouter
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
