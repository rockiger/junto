import React, { useGlobal } from 'reactn'
import { BrowserRouter as Router } from 'react-router-dom'
import clsx from 'clsx'
import { SnackbarProvider } from 'notistack'

import Footer from './footer'
import Header from './header'
import Main from './main'
import Sidebar from './sidebar'

import styles from './app.module.scss'

export default function App() {
    const [isSignedIn] = useGlobal('isSignedIn')

    return (
        <div
            className={clsx(styles.App, {
                [styles.App__isSignedIn]: isSignedIn,
            })}
        >
            <SnackbarProvider maxSnack={3}>
                <Router>
                    <Header />
                    {isSignedIn && <Sidebar />}
                    <Main />
                    {!isSignedIn && <Footer />}
                </Router>
            </SnackbarProvider>
        </div>
    )
}
