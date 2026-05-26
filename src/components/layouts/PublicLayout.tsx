import { Outlet } from '@tanstack/react-router'
import Footer from 'components/app/footer'
import Header from 'components/app/header'

/**
 * Marketing / guest shell: global header + main (no bottom dock).
 */
export default function PublicLayout() {
    return (
        <>
            <Header />
            <div className="bg-surface-container min-h-[calc(100dvh-64px)]">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
