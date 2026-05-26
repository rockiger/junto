import GoogleLoginUntyped from 'components/googleLogin'
import { Help } from 'components/help'
import { FooterLink } from 'components/staticPages/Footer'
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from 'lib/constants'
import { isEmpty } from 'lodash'
import SyncIcon from 'mdi-react/SyncIcon'
import type { ComponentType } from 'react'
import { useGlobal } from 'reactn'
import Navbar from './navbar'

const GoogleLogin = GoogleLoginUntyped as unknown as ComponentType<{
    apiKey: string
    buttonText?: string
    clientId: string
    discoveryDocs: string[]
    scope: string
}>

export default function Header() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const [initialFiles] = useGlobal('initialFiles')

    return (
        <div className="bg-surface-container px-2" style={{ gridArea: 'navigation' }}>
            <Navbar isSignedIn={isSignedIn}>
                {isSignedIn &&
                    isInitialFileListLoading &&
                    !isEmpty(initialFiles) && (
                        <div className="hidden md:flex items-center gap-1 text-xs font-medium text-fg-muted">
                            <SyncIcon className="h-4 shrink-0" />
                            Syncing...
                        </div>
                    )}
                {isSignedIn && <Help />}
                {!isSignedIn && (
                    <FooterLink to="/faq" title="Fulcrum FAQ">
                        FAQ
                    </FooterLink>
                )}
                {/*
                //@ts-ignore */}
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
