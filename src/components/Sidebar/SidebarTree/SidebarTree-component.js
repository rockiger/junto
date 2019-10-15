import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import { EXT, OVERVIEW_NAME } from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'

const useStyles = makeStyles({
    ul: {
        listStyleType: 'none',
        paddingLeft: 0,
    },
    group: {
        marginLeft: 0,
    },
})

export const SidebarTreeItem = props => {
    const classes = useStyles()
    const { nodeId, files, label, level, parentId } = props
    return (
        <li>
            <div key={nodeId} style={{ paddingLeft: level * 16 }}>
                {parentId ? <MenuDownIcon /> : <CircleSmallIcon />}
                <Link to={`/page/${nodeId}`}>{label}</Link>
                <button>+</button>
            </div>
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
        <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
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
