import { createFileRoute } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import { ArchivePage } from 'components/archive'

export const Route = createFileRoute('/archive')({
    component: ArchiveRoute,
})

function ArchiveRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <ArchivePage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
