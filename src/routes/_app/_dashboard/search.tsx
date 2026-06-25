import { createFileRoute } from '@tanstack/react-router'
import SearchResultsPage from 'components/Search/SearchResultsPage'
import { normalizeSearchQueryParam } from 'lib/search/search-helper'

export const Route = createFileRoute('/_app/_dashboard/search')({
    validateSearch: (search: Record<string, unknown>) => ({
        q: normalizeSearchQueryParam(search.q),
    }),
    component: SearchRoute,
})

function SearchRoute() {
    const { q } = Route.useSearch()

    return <SearchResultsPage query={normalizeSearchQueryParam(q)} />
}
