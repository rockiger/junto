//@ts-check

import { Navigate } from '@tanstack/react-router'
import { Spinner } from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'
import type { SortBy } from 'components/Home/FileList/fileList-component'
import { PageView } from 'components/Tracking'
import { LOCALSTORAGE_NAME } from 'lib/constants'
import StarIcon from 'mdi-react/StarIcon'
import { useEffect, useMemo, useGlobal, useState } from 'reactn'
import type { IFile } from 'reactn/default'

export default StarredPage
export { StarredPage as ArchivePage }

/**
 * @typedef ArchivePageProps
 * @property {boolean} isSignedIn
 * @property {boolean} isSigningIn
 */

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

/**
 * A archive-page component.
 * @param {ArchivePageProps} props
 */
function StarredPage({ isSignedIn, isSigningIn }: { isSignedIn: boolean, isSigningIn: boolean }) {
    const [files] = useGlobal('files')
    const starredFiles = useMemo(() => filterStarred(files), [files])
    const [sortBy, setSortBy] = useState(
        sortByLS &&
            (sortByLS === "modifiedByMeTime" || sortByLS === "viewedByMeTime")
            ? sortByLS
            : "modifiedByMeTime",
    )
    const setSortByAndLocalStorage = (sortBy: SortBy) => {
        setSortBy(sortBy)
        localStorage.setItem(localStorageKey, sortBy)
    }

    useEffect(() => {
        PageView({ pathname: '/starred' })
    }, [])

    if (isSignedIn && !isSigningIn) {
        return (
            <FileList
                emptyIcon={StarIcon}
                emptyMessage="No starred pages."
                emptySubline="Add stars to pages you want to easily refer to later."
                files={starredFiles}
                sortBy={sortBy as SortBy}
                setSortBy={setSortByAndLocalStorage}
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
    const filtered = files.filter(file => {
        return file.starred
    })
    return filtered
}
