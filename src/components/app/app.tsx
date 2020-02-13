import React, { useEffect, useGlobal } from 'reactn'
import { BrowserRouter as Router } from 'react-router-dom'
import classNames from 'classnames'

import { initGA, setGA } from 'components/Tracking'

import Footer from './footer'
import Header from './header'
import Main from './main'
import Sidebar from './sidebar'

import styles from './app.module.scss'
import { white, transparent } from 'material-ui/styles/colors'

export default function App() {
    const [isSignedIn] = useGlobal('isSignedIn')

    useEffect(() => {
        initGA('UA-151325933-1')
        setGA({ anonymizeIp: true })
    }, [])

    return (
        <div
            className={classNames(styles.App, {
                [styles.App__isSignedIn]: isSignedIn,
            })}
        >
            <Router>
                <Header />
                {isSignedIn && <Sidebar />}
                <Main />
                {!isSignedIn && <Footer />}
            </Router>
        </div>
    )
}
