import { Spinner } from 'components/gsuite-components/'
import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from 'components/gsuite-components/tabs'
import { PageView } from 'components/Tracking'
import WikiList from 'components/wiki-list'
import Search from 'components/app/header/search'
import { useSearchUI } from 'components/app/header/search-ui-context'
import { LOCALSTORAGE_NAME } from 'lib/constants'
import { filterIsNotArchived } from 'lib/helper/globalStateHelper'
import { useGoogleAuth } from 'lib/googleAuth'
import { useFileTree } from 'lib/query/files-queries'
import { navigateToSearch } from 'lib/search/navigate-to-search'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import { useIsDesktop } from 'lib/hooks/useMediaQuery'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { SelectionIndicator } from 'react-aria-components'
import {
    Disclosure,
    DisclosureHeader,
    DisclosurePanel,
} from 'components/gsuite-components/disclosure'
import FileList from './FileList'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

type SortBy = 'modifiedByMeTime' | 'viewedByMeTime' | 'sharedWithMeTime'

function Home({ isCreatingNewFile }: { isCreatingNewFile: boolean }) {
    const { isSignedIn, isSigningIn } = useGoogleAuth()
    const { data: initialFiles = [] } = useFileTree()
    const isDesktop = useIsDesktop()
    const notArchivedFiles = useMemo(
        () => filterIsNotArchived(initialFiles),
        [initialFiles],
    )
    const [sortBy, setSortBy] = useState(
        sortByLS &&
            (sortByLS === 'modifiedByMeTime' || sortByLS === 'viewedByMeTime')
            ? sortByLS
            : 'modifiedByMeTime',
    )

    const navigate = useNavigate()
    const { searchValue, resetSearchUI, setIsSearchFieldActive } = useSearchUI()

    useEffect(() => {
        PageView({ pathname: '/home' })
    }, [])

    const setSortByAndLocalStorage = (nextSortBy: SortBy) => {
        setSortBy(nextSortBy)
        localStorage.setItem(localStorageKey, nextSortBy)
    }

    const submit = () => {
        navigateToSearch(navigate, searchValue)
        setIsSearchFieldActive(false)
    }

    if (isSignedIn && !isSigningIn && !isCreatingNewFile) {
        return (
            <>
                <div className="dashboard-inline-search hidden lg:flex lg:justify-center">
                    <Search clearSearch={resetSearchUI} submit={submit} />
                </div>
                {!isDesktop && (
                    <Tabs className="w-full">
                        <TabList
                            aria-label="Tabs"
                            className="bg-surface-container flex w-full justify-around sticky top-0 z-10 lg:static"
                        >
                            <Tab
                                className="flex min-w-0 flex-1 cursor-pointer flex-col items-center py-0 text-fg-muted outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent/35 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-surface-container data-selected:text-tab-selected"
                                id="pages"
                            >
                                <div className="inline-flex max-w-full flex-col items-center gap-3 pt-3.5">
                                    <span className="text-sm font-medium px-0.5">
                                        Pages
                                    </span>
                                    <SelectionIndicator className="bg-tab-selected h-[3px] w-full max-w-full shrink-0" />
                                </div>
                            </Tab>
                            <Tab
                                className="flex min-w-0 flex-1 cursor-pointer flex-col items-center py-0 text-fg-muted outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent/35 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-surface-container data-selected:text-tab-selected"
                                id="wikis"
                            >
                                <div className="inline-flex max-w-full flex-col items-center gap-3 pt-3.5">
                                    <span className="text-sm font-medium px-0.5">
                                        Wikis
                                    </span>
                                    <SelectionIndicator className="bg-tab-selected h-[3px] w-full max-w-full shrink-0" />
                                </div>
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel
                                id="pages"
                                className="flex items-center justify-center"
                            >
                                <FileList
                                    emptyIcon={FileDocumentIcon}
                                    emptyMessage="Your archive is empty."
                                    emptySubline="The archive will show pages you archived"
                                    files={notArchivedFiles}
                                    sortBy={sortBy as SortBy}
                                    setSortBy={setSortByAndLocalStorage}
                                />
                            </TabPanel>
                            <TabPanel
                                id="wikis"
                                className="flex items-center justify-center"
                            >
                                <WikiList
                                    files={notArchivedFiles}
                                    isDashboard
                                    orderBy="date"
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}
                {isDesktop && (
                    <div className="flex flex-col gap-4 pb-4 px-6 pt-20">
                        <Disclosure className="grow" defaultExpanded>
                            <DisclosureHeader>Wikis</DisclosureHeader>
                            <DisclosurePanel>
                                <WikiList
                                    files={notArchivedFiles}
                                    isDashboard
                                    orderBy="date"
                                />
                            </DisclosurePanel>
                        </Disclosure>
                        <Disclosure className="grow" defaultExpanded>
                            <DisclosureHeader>Notes</DisclosureHeader>
                            <DisclosurePanel>
                                <FileList
                                    emptyIcon={FileDocumentIcon}
                                    emptyMessage="Your archive is empty."
                                    emptySubline="The archive will show pages you archived"
                                    files={notArchivedFiles}
                                    sortBy={'viewedByMeTime' as SortBy}
                                />
                            </DisclosurePanel>
                        </Disclosure>
                    </div>
                )}
            </>
        )
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <Spinner />
        </div>
    )
}

export default Home
