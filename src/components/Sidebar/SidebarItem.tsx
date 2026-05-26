// @ts-nocheck
//@ts-check
import { useDispatch } from 'reactn'
import { Link, useLocation } from '@tanstack/react-router'
import { Tooltip } from 'components/gsuite-components'

import { useStyles } from './SidebarItem-styles'
import clsx from 'clsx'

type SidebarItemProps = {
    icon: React.ReactNode
    name: string
    path: string
    tooltip?: string
    className?: string
}

export const SidebarItem = ({ icon: Icon, name, path, tooltip, className }: SidebarItemProps) => {
    const clearSearch = useDispatch('clearSearchComplete')
    const location = useLocation()
    const classes = useStyles()

    const { pathname } = location

    return (
        <Tooltip content={tooltip ? tooltip : name}>
            <Link
                className={clsx(classes.link, "hidden lg:flex", className)}
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
                        maxWidth: 'calc(100% - 40px)',
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
