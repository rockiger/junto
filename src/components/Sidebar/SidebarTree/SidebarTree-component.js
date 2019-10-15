import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'

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
    const { nodeId, files, label, level } = props
    return (
        <li style={{ paddingLeft: level * 16 }}>
            <div key={nodeId}>
                {label} <button>+</button>
            </div>
            {files && (
                <ul className={classes.ul}>
                    {files.map(file => (
                        <SidebarTreeItem
                            files={filterChildFiles(file.id, files)}
                            label={file.name}
                            nodeId={file.id}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}

export const SidebarTreeComponent = ({ rootFolderId, files }) => {
    return (
        <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            <SidebarTreeItem
                files={filterChildFiles(rootFolderId, files)}
                label="My Fulcrum"
                nodeId={rootFolderId}
                level={0}
            />
        </ul>
    )
}

function filterChildFiles(parentId, files) {
    return files.filter(file => file.parents.includes(parentId))
}
