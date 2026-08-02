//@ts-check

import { Navigate } from '@tanstack/react-router'
import { Spinner } from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'
import type { SortBy } from 'components/Home/FileList/fileList-component'
import { LOCALSTORAGE_NAME } from 'lib/constants'
import { useGoogleAuth } from 'lib/googleAuth'
import { useFileTree } from 'lib/query/files-queries'
import StarIcon from 'mdi-react/StarIcon'
import { useMemo, useState } from 'react'
import type { IFile } from 'types/app-state'

export default StarredPage
export { StarredPage as ArchivePage }

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

function StarredPage() {
    const { isSignedIn, isSigningIn } = useGoogleAuth()
    const { data: initialFiles = [] } = useFileTree()
    const starredFiles = useMemo(
        () => filterStarred(initialFiles),
        [initialFiles],
    )
    const [sortBy, setSortBy] = useState(
        sortByLS &&
            (sortByLS === 'modifiedByMeTime' || sortByLS === 'viewedByMeTime')
            ? sortByLS
            : 'modifiedByMeTime',
    )
    const setSortByAndLocalStorage = (nextSortBy: SortBy) => {
        setSortBy(nextSortBy)
        localStorage.setItem(localStorageKey, nextSortBy)
    }

    if (isSignedIn && !isSigningIn) {
        return (
            <FileList
                emptyIcon={StarIcon}
                emptyMessage="No starred pages."
                emptySubline="Add stars to pages you want to easily refer to later."
                files={starredFiles}
                sortBy={sortBy as SortBy}
                setSortBy={setSortByAndLocalStorage}
                tableMiddleColumn="date"
            />
        )
    } else if (!isSignedIn && isSigningIn) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <Navigate to="/" replace />
    }
}

export function filterStarred(files: IFile[]) {
    const filtered = files.filter((file) => {
        return file.starred
    })
    return filtered
}
