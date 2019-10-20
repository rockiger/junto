import React from 'reactn'

import { Link } from 'react-router-dom'

import { IconButton, Tooltip } from '@material-ui/core'

import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import MenuRightIcon from 'mdi-react/MenuRightIcon'
import PlusIcon from 'mdi-react/PlusIcon'

export function SidebarTreeLinkComponent(props) {
    const {
        classes,
        isExpanded,
        label,
        linkStyle,
        onCLickAddButton,
        onClickTreeButton,
        onMouseEnter,
        onMouseLeave,
        openButtonStyle,
        pageId,
        parentId,
        showAddButton,
    } = props

    return (
        <Link
            className={classes.link}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            to={`/page/${pageId}`}
            style={linkStyle}
        >
            {parentId ? (
                <IconButton
                    aria-label="open"
                    onClick={onClickTreeButton}
                    size="small"
                    style={openButtonStyle}
                >
                    {isExpanded ? <MenuDownIcon /> : <MenuRightIcon />}
                </IconButton>
            ) : (
                <CircleSmallIcon style={{ flexShrink: 0, margin: '0 3px' }} />
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
    )
}
