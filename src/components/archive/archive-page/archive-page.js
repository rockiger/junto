//@ts-check
import React, { useGlobal } from 'reactn'
import { Redirect } from 'react-router'

import Spinner from 'components/gsuite-components/spinner'
import FileList from 'components/Home/FileList'

import s from './archive-page.module.scss'
import { isArchived } from 'lib/helper'

export default ArchivePage
export { ArchivePage }

/**
 * @typedef ArchivePageProps
 * @property {boolean} isSignedIn
 * @property {boolean} isSigningIn
 */

/**
 * A archive-page component.
 * @param {ArchivePageProps} props
 */
function ArchivePage({ isSignedIn, isSigningIn }) {
    const [files] = useGlobal('files')
    if (isSignedIn && !isSigningIn) {
        return (
            <FileList
                emptyMessage="Your archive is empty."
                files={filterIsArchived(files)}
                sortBy="modifiedByMeTime"
                title="Archive"
            />
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
    const filtered = files.filter((file) => {
        return isArchived(file)
    })
    return filtered
}
