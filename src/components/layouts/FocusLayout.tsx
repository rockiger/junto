import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import Header from 'components/app/header'
import Sidebar from 'components/app/sidebar'
import { Hint } from 'components/gsuite-components/hint'
import PlusIcon from 'mdi-react/PlusIcon'
import type { ReactNode } from 'react'
import { useDispatch, useGlobal } from 'reactn'
import logo from '../../static/logo_48.svg'

const PAGE_HEADLINE = 'Wiki Page'

type FocusLayoutProps = {
    children: ReactNode
}

/**
 * Page editor shell: mobile keeps minimal chrome; desktop matches DashboardLayout grid.
 */
export default function FocusLayout({ children }: FocusLayoutProps) {
    const [isSignedIn] = useGlobal('isSignedIn')
    const clearSearch = useDispatch('clearSearchComplete')

    return (
        <div
            id="focus-layout"
            className={clsx(
                'flex min-h-dvh flex-col bg-surface-paper',
                'lg:grid lg:h-screen lg:overflow-hidden',
                "[grid-template-areas:'logo_navigation''newbutton_main''sidebar_main']",
                'lg:grid-cols-[256px_1fr] lg:grid-rows-[64px_auto_1fr] lg:bg-surface-container',
            )}
        >
            <Link
                id="logo"
                className="hidden items-center pl-6 text-xl font-normal text-fg-default no-underline lg:flex"
                style={{ gridArea: 'logo' }}
                to={isSignedIn ? '/home' : '/'}
            >
                <img
                    className={clsx('mr-3 max-h-6 md:max-h-10')}
                    src={logo}
                    alt="App logo"
                />
                <div>Fulcrum Wiki</div>
            </Link>
            <Header />
            <div
                id="newbutton"
                className="hidden px-4 pb-4 pt-2 lg:block"
                style={{ gridArea: 'newbutton' }}
            >
                <Hint id="new_page" scope="dashboard">
                    <Link
                        onClick={() => clearSearch()}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-surface-paper px-4 py-4 font-medium shadow-md/50 outline-none hover:bg-surface-hover focus-visible:ring-4 focus-visible:ring-accent-light"
                        aria-label="New wiki or page"
                        to="/new"
                    >
                        <PlusIcon size={28} />
                        <span>New</span>
                    </Link>
                </Hint>
            </div>
            <Sidebar />
            <main
                id="main-content"
                className={clsx(
                    'min-h-0 flex-1 bg-surface-paper',
                    'lg:flex lg:flex-col lg:h-[calc(100vh-64px)] lg:min-h-0 lg:overflow-y-scroll lg:bg-surface-paper lg:rounded-t-2xl',
                )}
                style={{ gridArea: 'main' }}
            >
                {children}
            </main>
        </div>
    )
}
