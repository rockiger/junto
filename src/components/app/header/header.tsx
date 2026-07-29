import GoogleLogin from 'components/googleLogin.tsx'
import { Help } from 'components/help'
import { FooterLink } from 'components/staticPages/Footer'
import { useGoogleAuth } from 'lib/googleAuth'
import { useFileTree } from 'lib/query/files-queries'
import { isEmpty } from 'lodash'
import SyncIcon from 'mdi-react/SyncIcon'
import Navbar from './navbar'

export default function Header() {
    const { isSignedIn } = useGoogleAuth()
    const { data: initialFiles, isFetching } = useFileTree()

    return (
        <div className="px-2 lg:pl-0" style={{ gridArea: 'navigation' }}>
            <Navbar isSignedIn={isSignedIn}>
                {isSignedIn &&
                    isFetching &&
                    initialFiles &&
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
                <GoogleLogin buttonText="Sign in" />
            </Navbar>
        </div>
    )
}
