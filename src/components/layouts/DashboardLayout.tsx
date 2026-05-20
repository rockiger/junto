import { Outlet } from '@tanstack/react-router'
import Header from 'components/app/header'
import Sidebar from 'components/app/sidebar'
import { DashboardMobileDock } from 'components/Home/dashboard-mobile'

/**
 * Logged-in list/overview shell: header, sidebar, mobile dock, main padding.
 */
export default function DashboardLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <div className="bg-sidebar pb-32 min-h-[calc(100dvh-64px)]">
                <Outlet />
            </div>
            <DashboardMobileDock />
        </>
    )
}
