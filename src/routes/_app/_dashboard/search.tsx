import { createFileRoute } from '@tanstack/react-router'
import SearchResultsPage from 'components/Search/SearchResultsPage'
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

    useEffect(() => {
        const query = normalizeSearchQueryParam(q)
        setSearchValue(query)
        setSearchTerm(query)
    }, [q, setSearchTerm, setSearchValue])

    return (
        <SearchResultsPage query={normalizeSearchQueryParam(q)} />
    )
}
