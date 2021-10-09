//@ts-check
import React, { useEffect, useGlobal } from 'reactn'
import { Redirect } from 'react-router'
import StarIcon from 'mdi-react/StarIcon'

import { Spinner } from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'
import { PageView } from 'components/Tracking'

export default StarredPage
export { StarredPage as ArchivePage }

/**
 * @typedef ArchivePageProps
 * @property {boolean} isSignedIn
 * @property {boolean} isSigningIn
 */

/**
 * A archive-page component.
 * @param {ArchivePageProps} props
 */
function StarredPage({ isSignedIn, isSigningIn }) {
    const [files] = useGlobal('files')

    useEffect(() => {
        PageView({ pathname: '/starred' })
    }, [])

    console.log({ files, starred: filterStarred(files) })
    if (isSignedIn && !isSigningIn) {
        return (
            <>
                <FileList
                    emptyIcon={StarIcon}
                    emptyMessage="No starred pages."
                    emptySubline="Add stars to pages you want to easily refer to later."
                    files={_.thread(files, filterStarred)}
                    sortBy="modifiedByMeTime"
                    title="Starred"
                />
            </>
        )
    } else if (!isSignedIn && isSigningIn) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <Redirect to={'/'} />
    }
}

export function filterStarred(files) {
    const filtered = files.filter(file => {
        return file.starred
    })
    return filtered
}
