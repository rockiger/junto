import FileListComponent from 'components/Home/FileList/fileList-component'
import type { SortBy } from 'components/Home/FileList/fileList-component'
import { Spinner } from 'components/gsuite-components'
import { filterSearchResultFiles } from 'lib/search/search-helper'
import FileSearchIcon from 'mdi-react/FileSearchIcon'
import { useMemo, useState } from 'react'
import { useGlobal } from 'reactn'

export type SearchResultsPageProps = {
    query: string
}

export default function SearchResultsPage({ query }: SearchResultsPageProps) {
    const [files] = useGlobal('files')
    const [initialFiles] = useGlobal('initialFiles')
    const [isFileListLoading] = useGlobal('isFileListLoading')
    const [sortBy, setSortBy] = useState<SortBy>('modifiedByMeTime')

    const trimmedQuery = query.trim()
    const displayFiles = useMemo(
        () => filterSearchResultFiles(files),
        [files],
    )

    const isLoading = trimmedQuery.length > 0 && isFileListLoading

    if (!trimmedQuery) {
        return (
            <div className="px-2 pb-4 pt-4 lg:px-6">
                <div className="rounded-2xl bg-surface-paper px-6 py-12 text-center shadow-sm">
                    <h2 className="m-0 text-2xl font-medium text-fg-default lg:hidden">
                        Search results
                    </h2>
                    <p className="m-0 text-lg text-fg-default lg:mt-0 mt-3">
                        Search your Fulcrum pages
                    </p>
                    <p className="mt-3 text-base text-text-muted">
                        Enter a search term in the bar above to find pages by
                        title or content.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 px-2 pb-4 pt-4 lg:px-6">
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Spinner />
                </div>
            ) : displayFiles.length === 0 ? (
                <div className="rounded-2xl bg-surface-paper px-6 py-12 text-center shadow-sm">
                    <FileSearchIcon
                        className="mx-auto mb-4 text-icon-blue"
                        size={48}
                    />
                    <p className="m-0 text-lg text-fg-default">
                        None of your pages matched this search.
                    </p>
                    <p className="mt-2 text-sm text-text-muted">
                        Try another search with a broader keyword.
                    </p>
                </div>
            ) : (
                <FileListComponent
                    emptyIcon={FileSearchIcon}
                    emptyMessage="None of your pages matched this search."
                    emptySubline="Try another search with a broader keyword."
                    files={displayFiles}
                    locationLookupFiles={initialFiles}
                    header="h2"
                    isLoading={false}
                    searchTerm={trimmedQuery}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                />
            )}
        </div>
    )
}
