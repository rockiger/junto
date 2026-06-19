// @ts-nocheck

import { Link, useLocation } from '@tanstack/react-router'
import clsx from 'clsx'
import AccountMultipleIcon from 'mdi-react/AccountMultipleIcon'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'
import ArchiveIcon from 'mdi-react/ArchiveIcon'
import ArchiveOutlineIcon from 'mdi-react/ArchiveOutlineIcon'
import HomeIcon from 'mdi-react/HomeIcon'
import HomeOutlineIcon from 'mdi-react/HomeOutlineIcon'
import PlusIcon from 'mdi-react/PlusIcon'
import StarIcon from 'mdi-react/StarIcon'
import StarOutlineIcon from 'mdi-react/StarOutlineIcon'
import ViewGridOutlineIcon from 'mdi-react/ViewGridOutlineIcon'
import ViewListOutlineIcon from 'mdi-react/ViewListOutlineIcon'
import { useEffect, useRef, useState } from 'react'
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components'
import { useDispatch } from 'reactn'

const MOBILE_MQ = '(max-width: 949px)'
const SCROLL_SHOW_HIDE_PX = 10

/** Hide FAB after net scroll down threshold; show after net scroll up (mobile dock only). */
function useScrollHideFabLinks() {
    const [fabVisible, setFabVisible] = useState(true)
    const visibleRef = useRef(true)
    const lastY = useRef(0)
    const downAccum = useRef(0)
    const upAccum = useRef(0)
    const rafId = useRef<number | null>(null)

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_MQ)

        const setVisible = (next: boolean) => {
            if (visibleRef.current === next) return
            visibleRef.current = next
            setFabVisible(next)
        }

        const resetAccumulatorsAtTop = (y: number) => {
            if (y <= 0) {
                downAccum.current = 0
                upAccum.current = 0
                setVisible(true)
            }
        }

        const onScrollFrame = () => {
            if (!mq.matches) return

            const y = window.scrollY
            resetAccumulatorsAtTop(y)

            const delta = y - lastY.current
            lastY.current = y

            if (delta === 0) return

            if (delta > 0) {
                downAccum.current += delta
                upAccum.current = 0
                if (downAccum.current >= SCROLL_SHOW_HIDE_PX && visibleRef.current) {
                    setVisible(false)
                    downAccum.current = 0
                }
            } else {
                upAccum.current += -delta
                downAccum.current = 0
                if (upAccum.current >= SCROLL_SHOW_HIDE_PX && !visibleRef.current) {
                    setVisible(true)
                    upAccum.current = 0
                }
            }
        }

        const onScroll = () => {
            if (!mq.matches) return
            if (rafId.current != null) return
            rafId.current = requestAnimationFrame(() => {
                rafId.current = null
                onScrollFrame()
            })
        }

        const applyMq = () => {
            if (!mq.matches) {
                downAccum.current = 0
                upAccum.current = 0
                lastY.current = window.scrollY
                setVisible(true)
                return
            }
            lastY.current = window.scrollY
            resetAccumulatorsAtTop(lastY.current)
        }

        applyMq()
        mq.addEventListener('change', applyMq)
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            mq.removeEventListener('change', applyMq)
            window.removeEventListener('scroll', onScroll)
            if (rafId.current != null) {
                cancelAnimationFrame(rafId.current)
            }
        }
    }, [])

    return fabVisible
}

/**
 * Section row (Drive "Dateien" + list/grid) for narrow viewports.
 */
export function DashboardSectionToolbar({ title, className }) {
    return (
        <div
            className={clsx(
                'max-[949px]:flex min-[950px]:hidden items-center justify-between px-4 pt-3',
                className
            )}
        >
            <span className="text-base font-semibold text-fg-default">
                {title}
            </span>
            <ToggleButtonGroup
                orientation="horizontal"
                selectionMode="single"
                disallowEmptySelection
                defaultSelectedKeys={new Set(['list'])}
                className="inline-flex items-center gap-0.5 rounded-full bg-[#e8f0fe] p-1"
                aria-label="View layout"
            >
                <ToggleButton
                    id="list"
                    className={({ isSelected, isPressed }) =>
                        clsx(
                            'flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors',
                            'focus-visible:ring-2 focus-visible:ring-accent',
                            isSelected
                                ? 'bg-[#3c4043] text-white'
                                : 'text-fg-muted hover:bg-white/60',
                            isPressed &&
                            !isSelected &&
                            'bg-white/80'
                        )
                    }
                >
                    <ViewListOutlineIcon size={20} />
                </ToggleButton>
                <ToggleButton
                    id="grid"
                    isDisabled
                    className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-fg-muted opacity-45 outline-none"
                    aria-label="Grid view (coming soon)"
                >
                    <ViewGridOutlineIcon size={20} />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

const NAV = [
    {
        to: '/home',
        label: 'Home',
        Icon: HomeOutlineIcon,
        IconSelected: HomeIcon,
        exact: true,
    },
    {
        to: '/starred',
        label: 'Starred',
        Icon: StarOutlineIcon,
        IconSelected: StarIcon,
        exact: false,
    },
    {
        to: '/shared-with-me',
        label: 'Shared',
        Icon: AccountMultipleOutlineIcon,
        IconSelected: AccountMultipleIcon,
        exact: false,
    },
    {
        to: '/archive',
        label: 'Archive',
        Icon: ArchiveOutlineIcon,
        IconSelected: ArchiveIcon,
        exact: false,
    },
]

/**
 * Drive-style FAB stack + bottom bar (narrow viewports only; shown via className wrappers).
 */
export function DashboardMobileDock() {
    const { pathname } = useLocation()
    const clearSearch = useDispatch('clearSearchComplete')
    const fabVisible = useScrollHideFabLinks()

    const linkActive = (to, exact) =>
        exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)

    return (
        <>
            <div
                className="fixed right-5 z-10 flex flex-col gap-3 transition-[opacity,transform] duration-200 ease-out lg:hidden"
                style={{
                    bottom: 'calc(6.75rem + env(safe-area-inset-bottom, 0px))',
                    opacity: fabVisible ? 1 : 0,
                    transform: fabVisible ? 'translateY(0)' : 'translateY(12px)',
                    pointerEvents: fabVisible ? undefined : ('none' as const),
                }}
                aria-hidden={!fabVisible}
            >
                <Link
                    onClick={() => clearSearch()}
                    className="flex size-20 items-center justify-center rounded-2xl bg-icon-blue-light text-icon-blue shadow-lg/30 outline-none transition-transform active:scale-95 focus-visible:ring-4 focus-visible:ring-accent-light"
                    aria-label="New wiki or page"
                    to="/new"
                    tabIndex={fabVisible ? 0 : -1}
                >
                    <PlusIcon size={36} />
                </Link>
            </div>

            <nav
                aria-label="Main"
                className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-divider bg-surface-container pt-2 lg:hidden"
            >
                {NAV.map(({ to, label, Icon, IconSelected, exact }) => {
                    const active = linkActive(to, exact)
                    return (
                        <Link
                            key={to}
                            onClick={() => clearSearch()}
                            to={to}
                            className={clsx(
                                'flex max-w-19 min-w-15 flex-1 flex-col items-center gap-0.5 py-2',
                                'text-xs font-medium no-underline outline-none transition-colors',
                                'rounded-t-lg focus-visible:ring-2 focus-visible:ring-accent',
                                active
                                    ? 'text-accent'
                                    : 'text-fg-muted hover:text-fg-default'
                            )}
                        >
                            <span
                                className={clsx(
                                    'flex h-10 w-17 items-center justify-center rounded-full',
                                    active && 'bg-icon-blue-lighter text-accent'
                                )}
                            >
                                {active ? <IconSelected color="currentColor" size={24} /> : <Icon color="currentColor" size={24} />}
                            </span>
                            {label}
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
