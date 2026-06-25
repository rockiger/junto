import { createFileRoute } from '@tanstack/react-router'

import { ArchivePage } from 'components/archive'

export const Route = createFileRoute('/_app/_dashboard/archive')({
    component: ArchiveRoute,
})

function ArchiveRoute() {
    return <ArchivePage />
}
