import { createFileRoute } from '@tanstack/react-router'

import { ArchivePage } from 'components/archive'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/archive')({
    component: ArchiveRoute,
})

function ArchiveRoute() {
    const isSignedIn = useAppStore((s) => s.isSignedIn)
    const isSigningIn = useAppStore((s) => s.isSigningIn)

    return <ArchivePage isSignedIn={isSignedIn} isSigningIn={isSigningIn} />
}
