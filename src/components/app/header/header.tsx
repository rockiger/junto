import React, { useGlobal } from 'reactn'

import Navbar from 'components/Navbar'
import GoogleLogin from 'components/googleLogin'
import { Help } from 'components/help'

import styles from './header.module.scss'

import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from 'lib/constants'

export default function Header(props: any) {
    const [isSignedIn] = useGlobal('isSignedIn')

    return (
        <div className={styles.Header}>
            <Navbar isSignedIn={isSignedIn}>
                <Help />
                <GoogleLogin
                    clientId={CLIENT_ID}
                    apiKey={API_KEY}
                    discoveryDocs={DISCOVERY_DOCS}
                    scope={SCOPES}
                    buttonText="Sign in"
                />
            </Navbar>
        </div>
    )
}
