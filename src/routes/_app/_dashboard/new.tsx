import { createFileRoute } from '@tanstack/react-router'

import { CreateNewWiki } from 'components/CreateNewWiki'

export const Route = createFileRoute('/_app/_dashboard/new')({
    component: NewWikiRoute,
})

function NewWikiRoute() {
    return <CreateNewWiki />
}
