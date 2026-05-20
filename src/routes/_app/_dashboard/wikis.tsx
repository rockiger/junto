import { createFileRoute } from '@tanstack/react-router'

import { WikiOverview } from 'components/wiki-overview'

export const Route = createFileRoute('/_app/_dashboard/wikis')({
    component: WikiOverview,
})
