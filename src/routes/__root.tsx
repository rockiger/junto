import { createRootRoute, Outlet } from '@tanstack/react-router'
import Footer from 'components/app/footer'
import Header from 'components/app/header'
import Sidebar from 'components/app/sidebar'
import { DashboardMobileDock } from 'components/Home/dashboard-mobile'
import { useGlobal } from 'reactn'

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    const [isSignedIn] = useGlobal('isSignedIn')

    return (
        <>
            <Header />
            {isSignedIn && <Sidebar />}
            <div className="bg-sidebar pb-32 min-h-[calc(100dvh-64px)]">
                <Outlet />
            </div>
            {!isSignedIn ? <Footer /> : <DashboardMobileDock />}
        </>
    )
}
