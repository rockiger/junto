// @ts-nocheck
//@ts-check
import { useDispatch } from 'reactn'
import { Link, useLocation } from '@tanstack/react-router'
import { Tooltip } from 'components/gsuite-components'
import clsx from 'clsx'
import type { ComponentType, SVGProps } from 'react'

type SidebarItemProps = {
    icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>
    name: string
    path: string
    tooltip?: string
    className?: string
}

export const SidebarItem = ({
    icon: Icon,
    name,
    path,
    tooltip,
    className,
}: SidebarItemProps) => {
    const clearSearch = useDispatch('clearSearchComplete')
    const location = useLocation()

    const { pathname } = location
    const isActive = pathname === path

    return (
        <Tooltip content={tooltip ? tooltip : name}>
            <Link
                className={clsx(
                    'flex h-8 w-[226px] grow items-center overflow-hidden rounded-full p-1 text-base leading-4 text-fg-default no-underline hover:bg-black/4',
                    'hidden lg:flex',
                    isActive && 'bg-[#e8f0fe] text-accent',
                    className,
                )}
                onClick={clearSearch}
                to={path}
            >
                <Icon
                    className={clsx(
                        isActive ? 'text-accent' : 'text-fg-muted',
                    )}
                />
                <div className="max-w-[calc(100%-40px)] grow truncate leading-normal ml-0.5">
                    {name}
                </div>
            </Link>
        </Tooltip>
    )
}
