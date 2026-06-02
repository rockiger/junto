import { Link, Outlet } from '@tanstack/react-router'
import Footer from 'components/app/footer'
import Header from 'components/app/header'
import logo from 'static/logo_48.svg'

/**
 * Marketing / guest shell: global header + main (no bottom dock).
 */
export default function PublicLayout() {
    return (
        <>
            <div className="bg-surface-container flex h-header items-center">
                <Link
                    id="logo"
                    className="flex items-center pl-6 text-xl font-normal text-fg-default no-underline"
                    style={{ gridArea: 'logo' }}
                    to={'/'}
                >
                    <img
                        className="mr-3 max-h-6 md:max-h-10"
                        src={logo}
                        alt="App logo"
                    />
                    <div>Fulcrum Wiki</div>
                </Link>
                <div className="min-w-0 flex-1">
                    <Header />
                </div>
            </div>
            <div className="bg-surface-container min-h-[calc(100dvh-64px)]">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
