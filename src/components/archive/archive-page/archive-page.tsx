// @ts-nocheck
//@ts-check

import { Navigate } from '@tanstack/react-router'
import {
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'
import { PageView } from 'components/Tracking'
import { WikiList } from 'components/wiki-list'
import { LOCALSTORAGE_NAME } from 'lib/constants'
import { isArchived } from 'lib/helper'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import { SelectionIndicator } from 'react-aria-components'
import { useEffect, useMemo, useGlobal, useState } from 'reactn'

export default ArchivePage
export { ArchivePage }

/**
 * @typedef ArchivePageProps
 * @property {boolean} isSignedIn
 * @property {boolean} isSigningIn
 */



const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

/**
 * A archive-page component.
 * @param {ArchivePageProps} props
 */
function ArchivePage({ isSignedIn, isSigningIn }) {
    const [files] = useGlobal('files')
    const archivedFiles = useMemo(() => filterIsArchived(files), [files])
    const [sortBy, setSortBy] = useState(
        sortByLS &&
            (sortByLS === "modifiedByMeTime" || sortByLS === "viewedByMeTime")
            ? sortByLS
            : "modifiedByMeTime",
    )

    const setSortByAndLocalStorage = (sortBy: SortBy) => {
        setSortBy(sortBy)
        localStorage.setItem(localStorageKey, sortBy)
    }

    useEffect(() => PageView({ pathname: '/archive' }), [])

    if (isSignedIn && !isSigningIn) {
        return (
            <>
                {true && (<Tabs className="w-full">
                    <TabList
                        aria-label="Tabs"
                        className="bg-surface-container flex w-full justify-around sticky top-0 z-10"
                    >
                        <Tab
                            className="flex min-w-0 flex-1 cursor-pointer flex-col items-center py-0 text-fg-muted outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent/35 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-surface-container data-selected:text-tab-selected"
                            id="pages"
                        >
                            <div className="inline-flex max-w-full flex-col items-center gap-3 pt-3.5">
                                <span className="text-sm font-medium px-0.5">Pages</span>
                                <SelectionIndicator
                                    className="bg-tab-selected h-[3px] w-full max-w-full shrink-0"
                                />
                            </div>
                        </Tab>
                        <Tab
                            className="flex min-w-0 flex-1 cursor-pointer flex-col items-center py-0 text-fg-muted outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent/35 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-surface-container data-selected:text-tab-selected"
                            id="wikis"
                        >
                            <div className="inline-flex max-w-full flex-col items-center gap-3 pt-3.5">
                                <span className="text-sm font-medium px-0.5">Wikis</span>
                                <SelectionIndicator
                                    className="bg-tab-selected h-[3px] w-full max-w-full shrink-0"
                                />
                            </div>
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel id="pages" className="flex items-center justify-center">
                            <FileList
                                emptyIcon={FileDocumentIcon}
                                emptyMessage="Your archive is empty."
                                emptySubline="The archive will show pages you archived"
                                files={archivedFiles}
                                sortBy={sortBy as SortBy}
                                setSortBy={setSortByAndLocalStorage}
                            />
                        </TabPanel>
                        <TabPanel id="wikis" className="flex items-center justify-center">
                            <WikiList
                                files={archivedFiles}
                                orderBy="date"
                            />					</TabPanel>
                    </TabPanels>
                </Tabs>
                )}
            </>
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

function filterIsArchived(files) {
    const filtered = _.filter(files, file => {
        return isArchived(file)
    })
    return filtered
}

function _filterPages(files) {
    const filtered = _.filter(files, file => {
        return !file.properties?.pageName
    })
    return filtered
}
