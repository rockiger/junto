import { useNavigate, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'
import IconButton from 'components/gsuite-components/icon-button'
import MenuIcon from 'mdi-react/MenuIcon'
import type { ReactNode } from 'react'
import { useAppStore } from 'store/app-store'
import { navigateToSearch } from 'lib/search/navigate-to-search'
import { useSearchUI } from './search-ui-context'
import Search from './search'

export type NavbarProps = {
    isSignedIn: boolean
    children?: ReactNode
}

function Navbar({ isSignedIn, children }: NavbarProps) {
    const navigate = useNavigate()
    const { searchValue, setIsSearchFieldActive, resetSearchUI } = useSearchUI()
    const showSidebarOnMobile = useAppStore((s) => s.showSidebarOnMobile)
    const setShowSidebarOnMobile = (value: boolean) =>
        useAppStore.setState({ showSidebarOnMobile: value })
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const searchQ = useRouterState({
        select: (s) => {
            const params = new URLSearchParams(s.location.searchStr)
            return params.get('q')?.trim() ?? ''
        },
    })
    const isHome =
        pathname === '/home' || pathname === '/' || pathname === '/search'
    const swapHeaderSearchOnDesktop =
        isHome && !searchQ && !searchValue.trim()

    const submit = () => {
        navigateToSearch(navigate, searchValue)
        setIsSearchFieldActive(false)
    }

    return (
        <div className="navbar flex h-header w-full">
            {isSignedIn && (
                <div className={clsx('flex items-center pr-2 lg:hidden')}>
                    <IconButton
                        onClick={() => {
                            setShowSidebarOnMobile(!showSidebarOnMobile)
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            )}
            <div className="flex flex-1 items-center">
                {isSignedIn && (
                    <Search
                        clearSearch={resetSearchUI}
                        submit={submit}
                        className={
                            swapHeaderSearchOnDesktop
                                ? 'dashboard-header-search--swappable'
                                : undefined
                        }
                    />
                )}
            </div>
            <div className={clsx('flex items-center pl-2 md:pr-2')}>
                {children}
            </div>
        </div>
    )
}

export default Navbar
