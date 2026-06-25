import { createFileRoute } from '@tanstack/react-router'

import StarredPage from 'components/Starred/StarredPage'

export const Route = createFileRoute('/_app/_dashboard/starred')({
    component: StarredRoute,
})

function StarredRoute() {
    return <StarredPage />
}
