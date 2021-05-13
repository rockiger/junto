//@ts-check
import React, { useGlobal } from 'reactn'
import { Redirect } from 'react-router'
import StarIcon from 'mdi-react/StarIcon'

import { H1, Spinner } from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'

import { isArchived } from 'lib/helper'

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

    if (isSignedIn && !isSigningIn) {
        return (
            <>
                <H1>Starred</H1>
                <FileList
                    emptyIcon={StarIcon}
                    emptyMessage="No starred pages."
                    emptySubline="Add stars to pages you want to easily refer to later."
                    files={_.thread(
                        files,
                        filterStarred,
                        filterPages,
                        filterIsArchived
                    )}
                    sortBy="modifiedByMeTime"
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

function filterIsArchived(files) {
    const filtered = files.filter(file => {
        return isArchived(file)
    })
    return filtered
}

function filterPages(files) {
    const filtered = files.filter(file => {
        return !file.properties || !file.properties.pageName
    })
    return filtered
}

function filterStarred(files) {
    const filtered = files.filter(file => {
        return files.starred
    })
    return filtered
}
