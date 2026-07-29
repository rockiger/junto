import { Link, Outlet } from '@tanstack/react-router'
import Footer from 'components/app/footer'
import Header from 'components/app/header'
import logo from 'static/logo_48.svg'

/**
 * Marketing / guest shell: global header + main (no bottom dock).
 */
export default function PublicLayout() {
    return (
        <div className="pub-theme">
            <header className="bg-surface-paper fixed flex h-header items-center shadow-md top-0 w-full z-10">
                <Link
                    id="logo"
                    className="flex h-full items-center gap-2 pl-6 text-fg-default no-underline"
                    style={{ gridArea: 'logo' }}
                    to={'/'}
                >
                    <img
                        className="block size-8 shrink-0 md:size-10"
                        src={logo}
                        alt="App logo"
                    />
                    <div className="font-semibold leading-none pt-1">Fulcrum Wiki</div>
                </Link>
                <div className="min-w-0 flex-1">
                    <Header />
                </div>
            </header>
            <div className="min-h-[calc(100dvh)] pt-16">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}
