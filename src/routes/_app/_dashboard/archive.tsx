import { createFileRoute } from '@tanstack/react-router'

import { ArchivePage } from 'components/archive'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/archive')({
    component: ArchiveRoute,
})

function ArchiveRoute() {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return <ArchivePage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
