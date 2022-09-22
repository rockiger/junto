import React, { useGlobal } from 'reactn'
import SyncIcon from 'mdi-react/SyncIcon'

import Navbar from 'components/Navbar'
import GoogleLogin from 'components/googleLogin'
import { Help } from 'components/help'
import { FooterLink } from 'components/staticPages/Footer'

import styles from './header.module.scss'

import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from 'lib/constants'

export default function Header(props: any) {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const [initialFiles] = useGlobal('initialFiles')

    return (
        <div className={styles.Header}>
            <Navbar isSignedIn={isSignedIn}>
                {isSignedIn &&
                    isInitialFileListLoading &&
                    //@ts-ignore
                    _.isNotEmpty(initialFiles) && (
                        <div
                            style={{
                                alignContent: 'center',
                                color: 'rgba(0, 0, 0, 0.54)',
                                display: 'flex',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }}
                        >
                            <SyncIcon style={{ height: '1rem' }} />
                            Syncing...
                        </div>
                    )}
                {isSignedIn && <Help />}
                {!isSignedIn && (
                    <FooterLink to="/faq" title="Fulcrum FAQ">
                        FAQ
                    </FooterLink>
                )}
            </Navbar>
        </div>
    )
}
