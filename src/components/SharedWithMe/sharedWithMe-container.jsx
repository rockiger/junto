import React, { useEffect, useGlobal } from 'reactn'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'

import Spinner from 'components/gsuite-components/spinner'
import FileList from 'components/Home/FileList'
import { PageView } from 'components/Tracking'

import { isArchived } from 'lib/helper'

function SharedWithMe(props) {
    const { isSignedIn, isSigningIn } = props
    const [files] = useGlobal('files')

    useEffect(() => PageView({ pathname: '/wikis' }), [])

    if (isSignedIn && !isSigningIn) {
        return (
            <FileList
                emptyIcon={AccountMultipleOutlineIcon}
                emptyMessage="Pages, others shared with you."
                emptySubline="If you open wiki pages others shared with from Google Drive they will be shown here."
                files={filterSharedWithMe(files)}
                sortBy="sharedWithMeTime"
                title="Shared With Me"
            />
        )
    } else if (!props.isSignedIn && props.isSigningIn) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <Redirect to={'/'} />
    }
}
SharedWithMe.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
}

function filterSharedWithMe(files) {
    const filtered = files.filter(file => {
        return (
            file.shared === true &&
            file.ownedByMe === false &&
            !isArchived(file)
        )
    })
    return filtered
}

export default SharedWithMe
