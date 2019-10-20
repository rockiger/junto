import React, { useGlobal, useState } from 'reactn'
import { withRouter } from 'react-router-dom'

import { useStyles } from './SidebarTree-styles'
import { SidebarTreeLink } from './SidebarTreeLink'
import Spinner from '../../spinner'
import { EXT, OVERVIEW_NAME, MYHOME } from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'

export const SidebarTreeItem = props => {
    const { expand = false, files, label, level, pageId, parentId } = props
    const [initialFiles] = useGlobal('initialFiles')

    const [isExpanded, setExpanded] = useState(expand)

    const classes = useStyles()

    return (
        <li>
            <SidebarTreeLink
                isExpanded={isExpanded}
                label={label}
                level={level}
                pageId={pageId}
                parentId={parentId}
                setExpanded={setExpanded}
            />
            {isExpanded && files && (
                <ul className={classes.ul}>
                    {files.map(file => {
                        const folderId = getFolderId(file.id, files)
                        if (shouldFileDisplay(file, parentId)) {
                            return (
                                <SidebarTreeItemWithRouter
                                    files={filterChildFiles(
                                        folderId,
                                        initialFiles
                                    )}
                                    key={file.id}
                                    label={getTitleFromFileName(file.name)}
                                    level={level + 1}
                                    pageId={file.id}
                                    parentId={folderId}
                                />
                            )
                        }
                        return null
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
                        files={sortFilesByName(files)}
                        label={MYHOME}
                        level={0}
                        pageId={getOverviewFileId(files)}
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

function sortFilesByName(files) {
    return files.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}
