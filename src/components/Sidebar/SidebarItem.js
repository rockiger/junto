import React, { useDispatch } from 'reactn'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from '@material-ui/core'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'

import { useStyles } from './SidebarItem-styles'

export const SidebarItem = props => {
    const clearSearch = useDispatch('clearSearch')
    const location = useLocation()
    const classes = useStyles()

    const { pathname } = location

    return (
        <Link
            className={classes.link}
            onClick={clearSearch}
            style={{
                backgroundColor:
                    pathname === '/shared-with-me' ? '#e8f0fe' : '',
                color: pathname === '/shared-with-me' ? '#4285f4' : '',
            }}
            to="/shared-with-me"
        >
            <AccountMultipleOutlineIcon
                style={{
                    color:
                        pathname === '/shared-with-me'
                            ? '#4285f4'
                            : 'rgba(0, 0, 0, 0.54)',
                }}
            />
            <Tooltip title="Shared With Me" enterDelay={200} leaveDelay={200}>
                <div
                    style={{
                        flexGrow: 1,
                        lineHeight: 1.5,
                        marginLeft: '.15rem',
                        maxWidth: 'calc(100% - 30px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Shared With Me
                </div>
            </Tooltip>
        </Link>
    )
}
