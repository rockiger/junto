import { createFileRoute } from '@tanstack/react-router'
import { WikiOverview } from 'components/wiki-overview'

export const Route = createFileRoute('/wikis')({
    component: WikiOverview,
})
