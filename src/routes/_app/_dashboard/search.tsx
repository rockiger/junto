import { createFileRoute } from '@tanstack/react-router'
import SearchResultsPage from 'components/Search/SearchResultsPage'
import { fetchSearchResults } from 'lib/search/fetch-search-results'
import { normalizeSearchQueryParam } from 'lib/search/search-helper'
import { useEffect } from 'react'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/search')({
    validateSearch: (search: Record<string, unknown>) => ({
        q: normalizeSearchQueryParam(search.q),
    }),
    component: SearchRoute,
})

function SearchRoute() {
    const { q } = Route.useSearch()
    const [, setSearchTerm] = useGlobal('searchTerm')
    const [, setSearchValue] = useGlobal('searchValue')
    const [isSignedIn] = useGlobal('isSignedIn')

    useEffect(() => {
        const query = normalizeSearchQueryParam(q)
        setSearchValue(query)
        setSearchTerm(query)
    }, [q, setSearchTerm, setSearchValue])

    useEffect(() => {
        if (!isSignedIn) {
            return
        }
        const query = normalizeSearchQueryParam(q)
        void fetchSearchResults(query)
    }, [q, isSignedIn])

    return (
        <SearchResultsPage query={normalizeSearchQueryParam(q)} />
    )
}
