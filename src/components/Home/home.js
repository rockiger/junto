import { useGlobal, useState } from 'reactn'
import PropTypes from 'prop-types'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import FileSearchIcon from 'mdi-react/FileSearchIcon'
import StarIcon from 'mdi-react/StarIcon'

import {
    Spinner,
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from 'components/gsuite-components/'
import { LOCALSTORAGE_NAME } from 'lib/constants'

import FrontPage from './front-page'
import FileList from './FileList'
import { filterIsNotArchived } from 'lib/helper/globalStateHelper'
import { filterStarred } from 'components/Starred'
import WikiList from 'components/wiki-list'
import { Hint } from 'components/gsuite-components/hint'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`

/** @typedef {{sortBy: 'modifiedByMeTime' | 'viewedByMeTime' | 'sharedWithMeTime'}} SortBy */
function Home(props) {
    const { isSignedIn, isSigningIn, isCreatingNewFile } = props

    const sortByLS = localStorage.getItem(localStorageKey)

    const [files] = useGlobal('files')
    const [searchTerm] = useGlobal('searchTerm')
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
                <Hint id="dashboard" scope="dashboard">
                    <h1
                        style={{
                            borderBottom: '1px solid #dadce0',
                            fontSize: '1.5rem',
                            fontWeight: 400,
                            margin: 0,
                            padding: '.5rem',
                        }}
                    >
                        {searchTerm ? 'Search results' : 'Dashboard'}
                    </h1>
                </Hint>
                <div
                    style={{
                        height: 'calc((100vh - 65px) - 56px)',
                        overflowY: 'auto',
                    }}
                >
                    {!searchTerm && (
                        <div>
                            <h2>Wikis</h2>
                            <WikiList
                                files={filterIsNotArchived(files)}
                                isDashboard
                                orderBy="date"
                            />
                            <h2>Recently used</h2>
                            <Tabs>
                                <TabList>
                                    <Tab>Pages</Tab>
                                    <Tab>Starred</Tab>
                                </TabList>
                                <TabPanel>
                                    <FileList
                                        emptyIcon={FileDocumentIcon}
                                        emptyMessage="Your archive is empty."
                                        emptySubline="The archive will show pages you archived"
                                        files={files}
                                        sortBy={'modified'}
                                        setSortBy={setSortByAndLocalStorage}
                                        title="Dashboard"
                                    />
                                </TabPanel>
                                <TabPanel
                                    style={{
                                        maxHeight: 'calc(100vh - 168px)',
                                        overflow: 'auto',
                                    }}
                                >
                                    <FileList
                                        emptyIcon={StarIcon}
                                        emptyMessage="No starred pages."
                                        emptySubline="Add stars to pages you want to easily refer to later."
                                        files={filterStarred(files)}
                                        sortBy={'modified'}
                                        setSortBy={setSortByAndLocalStorage}
                                        title="Dashboard"
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    )}
                    {searchTerm && (
                        <FileList
                            emptyIcon={FileSearchIcon}
                            emptyMessage={
                                searchTerm
                                    ? 'None of your pages matched this search.'
                                    : 'There are no pages in this view.'
                            }
                            emptySubline={
                                searchTerm
                                    ? 'Try another search with a broader keyword.'
                                    : ''
                            }
                            files={files}
                            header="h2"
                            sortBy={'modified'}
                            setSortBy={setSortByAndLocalStorage}
                            title={searchTerm ? '' : 'Pages'}
                        />
                    )}
                </div>
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

Home.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
}

export default Home
