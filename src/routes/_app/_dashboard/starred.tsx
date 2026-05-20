import { createFileRoute } from '@tanstack/react-router'

import StarredPage from 'components/Starred/StarredPage'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/starred')({
    component: StarredRoute,
})

function StarredRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <StarredPage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
