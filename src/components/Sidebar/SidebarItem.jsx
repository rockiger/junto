//@ts-check
import React, { useDispatch } from 'reactn'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from 'components/gsuite-components'

import { useStyles } from './SidebarItem-styles'

/**
 * @typedef SidebarItemProps
 * @property {any}    icon the icon
 * @property {string} name the link name
 * @property {string} path the path to compare activeness agains
 * @property {string} [tooltip] tooltip text
 */

export const SidebarItem = ({ icon: Icon, name, path, tooltip }) => {
    const clearSearch = useDispatch('clearSearchComplete')
    const location = useLocation()
    const classes = useStyles()

    const { pathname } = location

    return (
        <Tooltip content={tooltip ? tooltip : name}>
            <Link
                className={classes.link}
                onClick={clearSearch}
                style={{
                    backgroundColor: pathname === path ? '#e8f0fe' : '',
                    color: pathname === path ? '#4285f4' : '',
                }}
                to={path}
            >
                <Icon
                    style={{
                        color:
                            pathname === path
                                ? '#4285f4'
                                : 'rgba(0, 0, 0, 0.54)',
                    }}
                />
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
                    {name}
                </div>
            </Link>
        </Tooltip>
    )
}
