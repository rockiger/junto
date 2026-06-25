// @ts-nocheck
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from '@tanstack/react-router'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'

import Spinner from 'components/gsuite-components/spinner'
import FileList from 'components/Home/FileList'
import { PageView } from 'components/Tracking'
import { useGoogleAuth } from 'lib/googleAuth'
import { useFileTree } from 'lib/query/files-queries'

import { isArchived } from 'lib/helper'

function SharedWithMe(props) {
    const { isCreatingNewFile } = props
    const { isSignedIn, isSigningIn } = useGoogleAuth()
    const { data: initialFiles = [] } = useFileTree()
    const sharedFiles = useMemo(
        () => filterSharedWithMe(initialFiles),
        [initialFiles],
    )

    useEffect(() => PageView({ pathname: '/shared-with-me' }), [])

    if (isSignedIn && !isSigningIn && !isCreatingNewFile) {
        return (
            <FileList
                emptyIcon={AccountMultipleOutlineIcon}
                emptyMessage="Pages, others shared with you."
                emptySubline="If you open wiki pages others shared with from Google Drive they will be shown here."
                files={sharedFiles}
                sortBy="sharedWithMeTime"
                tableMiddleColumn="date"
                title="Shared with me"
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
SharedWithMe.propTypes = {
    isCreatingNewFile: PropTypes.bool,
}

function filterSharedWithMe(files) {
    const filtered = files.filter((file) => {
        return (
            file.shared === true &&
            file.ownedByMe === false &&
            !isArchived(file)
        )
    })
    return filtered
}

export default SharedWithMe
