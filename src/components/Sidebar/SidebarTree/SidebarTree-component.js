import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import { EXT } from '../../../lib/constants'
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
    console.log({ parentId })
    return (
        <li>
            <div key={nodeId} style={{ paddingLeft: level * 16 }}>
                {parentId ? <MenuDownIcon /> : <CircleSmallIcon />} {label}{' '}
                <button>+</button>
            </div>
            {files && (
                <ul className={classes.ul}>
                    {files.map(file => {
                        const folderId = getFolderId(file.id, files)
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItem
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

export const SidebarTreeComponent = ({ rootFolderId, files }) => {
    return (
        <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            <SidebarTreeItem
                files={files}
                label="My Fulcrum"
                level={0}
                nodeId={rootFolderId}
                parentId={rootFolderId}
            />
        </ul>
    )
}

function getFolderId(fileId, files) {
    const folder = files.find(file => file.name === fileId)
    return folder ? folder.id : null
}
function filterChildFiles(folderId, files) {
    if (folderId) return files.filter(file => file.parents.includes(folderId))
    return []
}

function filterRootChildFiles(rootFolderId, files) {
    return files.filter(file => file.parents.includes(rootFolderId))
}

function shouldFileDisplay(file, parentId) {
    const { mimeType, name, parents, trashed } = file
    return (
        mimeType === 'application/json' &&
        name.endsWith(EXT) &&
        parents.includes(parentId) &&
        trashed === false
    )
}
