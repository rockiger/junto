import { createFileRoute } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import StarredPage from 'components/Starred/StarredPage'

export const Route = createFileRoute('/starred')({
    component: StarredRoute,
})

function StarredRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <StarredPage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
