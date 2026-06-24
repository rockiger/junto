import { createFileRoute } from '@tanstack/react-router'

import StarredPage from 'components/Starred/StarredPage'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/starred')({
    component: StarredRoute,
})

function StarredRoute() {
    const isSignedIn = useAppStore((s) => s.isSignedIn)
    const isSigningIn = useAppStore((s) => s.isSigningIn)

    return <StarredPage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
