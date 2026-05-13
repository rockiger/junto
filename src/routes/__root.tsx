import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import Header from 'components/app/header'
import Footer from 'components/app/footer'
import Sidebar from 'components/app/sidebar'
import styles from 'components/app/main/main.module.scss'

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    const [isSignedIn] = useGlobal('isSignedIn')

    return (
        <>
            <Header />
            {isSignedIn && <Sidebar />}
            <div className={styles.Main}>
                <Outlet />
            </div>
            {!isSignedIn && <Footer />}
        </>
    )
}
