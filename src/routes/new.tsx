import { createFileRoute } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import { CreateNewWiki } from 'components/CreateNewWiki'

export const Route = createFileRoute('/new')({
    component: NewWikiRoute,
})

function NewWikiRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <CreateNewWiki isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
