import React, { useGlobal, useState } from 'reactn'
import PropTypes from 'prop-types'

import { Spinner } from 'components/gsuite-components'
import { LOCALSTORAGE_NAME } from 'lib/constants'

import FrontPage from './front-page'
import FileList from './FileList'
import { isArchived } from 'lib/helper'
import WikiList from 'components/wiki-list'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`

/** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime' | 'sharedWithMeTime'}} SortBy */
function Home(props) {
    const [isFileListLoading] = useGlobal('isFileListLoading')
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
    const setSortByAndLocalStorage = sortBy => {
        console.log({ sortBy })
        setSortBy(sortBy)
        //@ts-ignore
        localStorage.setItem(localStorageKey, sortBy)
    }

    if (isSignedIn && !isSigningIn && !isCreatingNewFile) {
        return (
            <>
                {isFileListLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <h1
                            style={{
                                borderBottom: '1px solid #dadce0',
                                fontSize: '1.5rem',
                                fontWeight: 400,
                                margin: 0,
                                padding: '.5rem',
                            }}
                        >
                            Dashboard
                        </h1>
                        <div
                            style={{
                                height: 'calc((100vh - 65px) - 56px)',
                                overflowY: 'auto',
                            }}
                        >
                            <h2>Wikis</h2>
                            <WikiList
                                files={filterIsNotArchived(files)}
                                isDashboard
                            />
                            <FileList
                                emptyMessage="There are no files in this view."
                                files={filterIsNotArchived(files)}
                                header="h2"
                                sortBy={sortBy}
                                setSortBy={setSortByAndLocalStorage}
                                title="Pages"
                            />
                        </div>
                    </>
                )}
            </>
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

function filterIsNotArchived(files) {
    const filtered = files.filter(file => {
        return !isArchived(file)
    })
    return filtered
}

Home.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
}

export default Home
