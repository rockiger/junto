import React, { useGlobal } from 'reactn'
import { Link, useHistory, withRouter } from 'react-router-dom'
import { IconButton, Tooltip } from '@material-ui/core'

import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import MenuRightIcon from 'mdi-react/MenuRightIcon'
import PlusIcon from 'mdi-react/PlusIcon'

import { useStyles } from './SidebarTree-styles'
import { getPageId, getParentFolderId, isPage } from '../Sidebar-helper'
import Spinner from '../../spinner'
import { createFile, updateFile, createNewWiki } from '../../../lib/gdrive'
import {
    EMPTYVALUE,
    EXT,
    OVERVIEW_NAME,
    MYHOME,
    UNTITLEDFILE,
} from '../../../lib/constants'
import { getTitleFromFileName } from '../../../lib/helper'
import { useState } from 'react'
export const SidebarTreeItem = props => {
    const {
        expand = false,
        files,
        label,
        level,
        location,
        pageId,
        parentId,
    } = props
    const [, setGoToNewFile] = useGlobal('goToNewFile')
    const [initialFiles] = useGlobal('initialFiles')
    const [, setBackgroundUpdate] = useGlobal('backgroundUpdate')
    const [, setSearchTerm] = useGlobal('searchTerm')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')

    const [isExpanded, setExpanded] = useState(expand)
    const [showAddButton, setShowAddButton] = useState(false)

    const classes = useStyles()
    const history = useHistory()

    const currentPageId = isPage(location) ? getPageId(location) : null

    function onClickTreeButton(ev) {
        ev.preventDefault()
        setExpanded(!isExpanded)
    }

    async function onCLickAddButton(ev) {
        ev.preventDefault(ev)

        setIsCreatingNewFile(true)
        let parentFolderIdOfNewFile = parentId
        if (!parentFolderIdOfNewFile) {
            const parentFolderId = getParentFolderId(pageId, initialFiles)
            try {
                parentFolderIdOfNewFile = await createNewWiki(
                    pageId,
                    parentFolderId
                )
            } catch (err) {
                setIsCreatingNewFile(false)
                console.log(err)
            }
        }

        try {
            console.log(parentFolderIdOfNewFile)
            const newFileId = await createFile(
                UNTITLEDFILE,
                parentFolderIdOfNewFile
            )
            const result = await updateFile(
                newFileId,
                JSON.stringify(EMPTYVALUE)
            )

            console.log(result)

            setGoToNewFile(true)
            setSearchTerm('')
            setIsCreatingNewFile(false)
            setBackgroundUpdate(true)
            history.push(`/page/${newFileId}`)
        } catch (err) {
            setIsCreatingNewFile(false)
            console.log(err)
        }
    }

    function onMouseEnter(ev) {
        setShowAddButton(true)
    }

    function onMouseLeave(ev) {
        setShowAddButton(false)
    }

    return (
        <li>
            <Link
                className={classes.link}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                to={`/page/${pageId}`}
                style={{
                    color:
                        currentPageId === pageId ? 'var(--primary-color)' : '',
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
                                currentPageId === pageId
                                    ? 'var(--primary-color)'
                                    : '',
                            flexShrink: 0,
                            margin: '0 3px',
                            padding: 0,
                        }}
                    >
                        {isExpanded ? <MenuDownIcon /> : <MenuRightIcon />}
                    </IconButton>
                ) : (
                    <CircleSmallIcon
                        style={{ flexShrink: 0, margin: '0 3px' }}
                    />
                )}
                <Tooltip title={label} enterDelay={200} leaveDelay={200}>
                    <div
                        style={{
                            flexGrow: 1,
                            lineHeight: 1.5,
                            maxWidth: 'calc(100% - 30px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </div>
                </Tooltip>
                {showAddButton && (
                    <IconButton
                        aria-label="add"
                        className={classes.addButton}
                        onClick={onCLickAddButton}
                        size="small"
                    >
                        <PlusIcon />
                    </IconButton>
                )}
            </Link>
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
