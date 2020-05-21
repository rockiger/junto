import React, { useGlobal, useState } from 'reactn'
import PropTypes from 'prop-types'

import Spinner from 'components/gsuite-components/spinner'
import { LOCALSTORAGE_NAME } from 'lib/constants'

import FrontPage from './front-page'
import FileList from './FileList'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`

/** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime' | 'sharedWithMeTime'}} SortBy */
function Home(props) {
    const { isSignedIn, isSigningIn, isCreatingNewFile } = props
    const sortByLS = localStorage.getItem(localStorageKey)

    const [files] = useGlobal('files')
    const [sortBy, setSortBy] = useState(
        sortByLS &&
            (sortByLS === 'modifiedByMeTime' || sortByLS === 'viewedByMeTime')
            ? sortByLS
            : 'modifiedByMeTime'
    )

    /**
     * @param {SortBy} sortBy
     * @returns {void}
     */
    const setSortByAndLocalStorage = (sortBy) => {
        console.log({ sortBy })
        setSortBy(sortBy)
        //@ts-ignore
        localStorage.setItem(localStorageKey, sortBy)
    }

    if (isSignedIn && !isSigningIn && !isCreatingNewFile) {
        return (
            <FileList
                emptyMessage="There are no files in this view."
                files={files}
                sortBy={sortBy}
                setSortBy={setSortByAndLocalStorage}
                title="Your Work"
            />
        )
    } else if ((!props.isSignedIn && props.isSigningIn) || isCreatingNewFile) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <FrontPage />
    }
}
Home.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
}

export default Home
