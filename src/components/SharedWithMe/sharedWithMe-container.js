import React, { useGlobal } from 'reactn'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

import Spinner from 'components/gsuite-components/spinner'

import FileList from 'components/Home/FileList'
import { isArchived } from 'lib/helper'

function SharedWithMe(props) {
    const { isSignedIn, isSigningIn } = props
    const [files] = useGlobal('files')
    if (isSignedIn && !isSigningIn) {
        return (
            <FileList
                emptyMessage="You don't have any shared files."
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
