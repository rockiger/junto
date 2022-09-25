import React, { useEffect, useGlobal } from 'reactn'
import { BrowserRouter as Router } from 'react-router-dom'

import clsx from 'clsx'
import { SnackbarProvider } from 'notistack'
import { initGA, setGA } from 'components/Tracking'

import Footer from './footer'
import Header from './header'
import Main from './main'
import Sidebar from './sidebar'

import styles from './app.module.scss'
import { getFiles, getWikis } from 'db'

export default function App() {
    const [isSignedIn] = useGlobal('isSignedIn')

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            initGA('UA-151325933-1')
            setGA({ anonymizeIp: true })
        }
    }, [])

    useEffect(() => {
        getWikis()
        getFiles()
    }, [])

    return (
        <div
            className={clsx(styles.App, {
                [styles.App__isSignedIn]: isSignedIn,
            })}
        >
            <SnackbarProvider maxSnack={3}>
                <Router basename={'/fulcrum'}>
                    <Header />
                    {isSignedIn && <Sidebar />}
                    <Main />
                    {!isSignedIn && <Footer />}
                </Router>
            </SnackbarProvider>
        </div>
    )
}
