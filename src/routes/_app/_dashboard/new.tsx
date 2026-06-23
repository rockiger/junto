import { createFileRoute } from '@tanstack/react-router'

import { CreateNewWiki } from 'components/CreateNewWiki'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/new')({
    component: NewWikiRoute,
})

function NewWikiRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <CreateNewWiki isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
