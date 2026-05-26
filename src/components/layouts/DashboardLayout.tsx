import { Link, Outlet } from '@tanstack/react-router'
import clsx from 'clsx'
import Header from 'components/app/header'
import Sidebar from 'components/app/sidebar'
import { Hint } from 'components/gsuite-components/hint'
import { DashboardMobileDock } from 'components/Home/dashboard-mobile'
import { useDispatch, useGlobal } from 'reactn'
import logo from "../../static/logo_48.svg"
import PlusIcon from 'mdi-react/PlusIcon'
/**
 * Logged-in list/overview shell: header, sidebar, mobile dock, main padding.
 */
export default function DashboardLayout() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const clearSearch = useDispatch('clearSearchComplete')

    return (
        <div id="dashboard-layout" className="lg:grid [grid-template-areas:'logo_navigation''newbutton_headline''sidebar_main'] lg:grid-cols-[256px_1fr] lg:grid-rows-[64px_auto_1fr]">
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
            {/* <!-- New Button is shown in the sidebar --> */}
            <div id="newbutton" className="hidden pb-4 pt-2 px-4 lg:block" style={{
                gridArea: 'newbutton'
            }}>
                <Hint id="new_page" scope="dashboard">
                    <Link
                        onClick={() => clearSearch()}
                        className="inline-flex items-center font-medium gap-3 justify-center rounded-2xl shadow-md/50 outline-none px-4 py-4 focus-visible:ring-4 focus-visible:ring-accent-light hover:bg-surface-hover"
                        aria-label="New wiki or page"
                        to="/new"
                    >
                        <PlusIcon size={28} />
                        <span>New</span>
                    </Link>
                </Hint>
            </div>
            <div id="headline" className="hidden pl-2 pt-6 lg:block" style={{
                gridArea: 'headline',
            }}>
                <h1 className="text-2xl font-medium">Welcome to Fulcrum Wiki</h1>
            </div>
            <Sidebar />
            {/* <!-- Main content headline --> */}
            <div className="bg-surface-container pb-32 min-h-[calc(100dvh-64px)]">
                <Outlet />
            </div>
            <DashboardMobileDock />
        </div>
    )
}
