import { createFileRoute } from '@tanstack/react-router'

import { CreateNewWiki } from 'components/CreateNewWiki'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/new')({
    component: NewWikiRoute,
})

function NewWikiRoute() {
    const isSignedIn = useAppStore((s) => s.isSignedIn)
    const isSigningIn = useAppStore((s) => s.isSigningIn)

    return <CreateNewWiki isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
