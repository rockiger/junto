import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'
import Header from 'components/app/header'
import Sidebar from 'components/app/sidebar'
import { Hint } from 'components/gsuite-components/hint'
import { DashboardMobileDock } from 'components/Home/dashboard-mobile'
import { useEffect, useRef } from 'react'
import { getGlobal, useDispatch, useGlobal } from 'reactn'
import logo from "../../static/logo_48.svg"
import PlusIcon from 'mdi-react/PlusIcon'
/**
 * Logged-in list/overview shell: header, sidebar, mobile dock, main padding.
 */
const DASHBOARD_HEADLINE = 'Welcome to Fulcrum Wiki'
const SEARCH_HEADLINE = 'Search results'

export default function DashboardLayout() {
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const isSearchPage = pathname === '/search'
    const [isSignedIn] = useGlobal('isSignedIn')
    const clearSearch = useDispatch('clearSearchComplete')
    const [, setIsSearchFieldActive] = useGlobal('isSearchFieldActive')
    const layoutRef = useRef<HTMLDivElement>(null)
    const mainContentRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const main = mainContentRef.current
        const layout = layoutRef.current
        if (!main || !layout) return

        const onScroll = () => {
            const scrolled = main.scrollTop > 0
            const isScrolled = layout.dataset.mainScrolled === 'true'
            if (scrolled === isScrolled) return

            layout.dataset.mainScrolled = scrolled ? 'true' : 'false'

            const headlineCenter = layout.querySelector<HTMLElement>('.dashboard-headline__center')
            const headlineLeft = layout.querySelector<HTMLElement>('.dashboard-headline__left')
            headlineCenter?.setAttribute('aria-hidden', scrolled ? 'true' : 'false')
            headlineLeft?.setAttribute('aria-hidden', scrolled ? 'false' : 'true')

            if (scrolled && getGlobal().isSearchFieldActive) {
                setIsSearchFieldActive(false)
            }
        }

        onScroll()
        main.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            main.removeEventListener('scroll', onScroll)
            delete layout.dataset.mainScrolled
        }
    }, [setIsSearchFieldActive])

    return (
        <div ref={layoutRef} id="dashboard-layout" className="lg:grid [grid-template-areas:'logo_navigation''newbutton_headline''sidebar_main'] lg:grid-cols-[256px_1fr] lg:grid-rows-[64px_auto_1fr] lg:h-screen lg:overflow-hidden">
            <Link
                id="logo"
                className="hidden items-center pl-6 text-xl font-normal text-fg-default no-underline lg:flex"
                style={{ gridArea: 'logo' }}
                to={isSignedIn ? '/home' : '/'}
            >
                <img
                    className={clsx("mr-3 max-h-6 md:max-h-10")}
                    src={logo}
                    alt="App logo"
                />
                <div>Fulcrum Wiki</div>
            </Link>
            <Header />
            {/* <!-- New Button is shown in the sidebar //! add hint here --> */}
            <div id="newbutton" className="hidden pb-4 pt-2 px-4 lg:block" style={{
                gridArea: 'newbutton'
            }}>
                <Hint id="new_page" scope="dashboard">
                    <Link
                        onClick={() => clearSearch()}
                        className="bg-surface-paper inline-flex items-center font-medium gap-3 justify-center rounded-2xl shadow-md/50 outline-none px-4 py-4 focus-visible:ring-4 focus-visible:ring-accent-light hover:bg-surface-hover"
                        aria-label="New wiki or page"
                        to="/new"
                    >
                        <PlusIcon size={28} />
                        <span>New</span>
                    </Link>
                </Hint>
            </div>
            <div id="headline" className="hidden px-6 pt-6 lg:bg-surface-paper lg:rounded-t-2xl lg:block" style={{
                gridArea: 'headline',
            }}>
                {isSearchPage ? (
                    <h1 className="m-0 text-left text-2xl font-medium text-text-muted">
                        {SEARCH_HEADLINE}
                    </h1>
                ) : (
                    <h1 className="dashboard-headline font-medium text-2xl text-text-muted">
                        <span className="dashboard-headline__center">{DASHBOARD_HEADLINE}</span>
                        <span className="dashboard-headline__left" aria-hidden="true">{DASHBOARD_HEADLINE}</span>
                    </h1>
                )}
            </div>
            <Sidebar />
            {/* <!-- Main content headline --> */}
            <main ref={mainContentRef} id="main-content" className="bg-surface-container pb-32 min-h-[calc(100dvh-64px)] lg:bg-surface-paper lg:h-[calc(100vh-64px-84px)] lg:min-h-0 lg:overflow-y-scroll">
                <Outlet />
            </main>
            <DashboardMobileDock />
        </div>
    )
}
