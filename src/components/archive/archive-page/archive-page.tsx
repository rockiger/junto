import { Navigate } from '@tanstack/react-router'
import { Spinner } from 'components/gsuite-components/'
import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from 'components/gsuite-components/tabs'
import {
	Disclosure,
	DisclosureHeader,
	DisclosurePanel,
} from 'components/gsuite-components/disclosure'
import FileList from 'components/Home/FileList'
import type { SortBy } from 'components/Home/FileList/fileList-component'
import { PageView } from 'components/Tracking'
import { WikiList } from 'components/wiki-list'
import { LOCALSTORAGE_NAME } from 'lib/constants'
import { isArchived } from 'lib/helper'
import { useIsDesktop } from 'lib/hooks/useMediaQuery'
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import { SelectionIndicator } from 'react-aria-components'
import { useEffect, useMemo, useGlobal, useState } from 'reactn'
import type { IFile } from 'reactn/default'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

function ArchivePage({
	isSignedIn,
	isSigningIn,
}: {
	isSignedIn: boolean
	isSigningIn: boolean
}) {
	const [initialFiles] = useGlobal('initialFiles')
	const isDesktop = useIsDesktop()
	const archivedFiles = useMemo(
		() => filterIsArchived(initialFiles),
		[initialFiles],
	)
	const [sortBy, setSortBy] = useState(
		sortByLS &&
			(sortByLS === 'modifiedByMeTime' || sortByLS === 'viewedByMeTime')
			? sortByLS
			: 'modifiedByMeTime',
	)

	const setSortByAndLocalStorage = (nextSortBy: SortBy) => {
		setSortBy(nextSortBy)
		localStorage.setItem(localStorageKey, nextSortBy)
	}

	useEffect(() => PageView({ pathname: '/archive' }), [])

	if (isSignedIn && !isSigningIn) {
		return (
			<>
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
									files={archivedFiles}
									locationLookupFiles={initialFiles}
									sortBy={sortBy as SortBy}
									setSortBy={setSortByAndLocalStorage}
								/>
							</TabPanel>
							<TabPanel
								id="wikis"
								className="flex items-center justify-center"
							>
								<WikiList
									files={archivedFiles}
									isDashboard={false}
									orderBy="date"
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>
				)}
				{isDesktop && (
					<div className="flex flex-col gap-4 px-6 py-5">
						<Disclosure className="grow" defaultExpanded>
							<DisclosureHeader>Wikis</DisclosureHeader>
							<DisclosurePanel>
								<WikiList
									files={archivedFiles}
									isDashboard={false}
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
									files={archivedFiles}
									locationLookupFiles={initialFiles}
									sortBy={'viewedByMeTime' as SortBy}
								/>
							</DisclosurePanel>
						</Disclosure>
					</div>
				)}
			</>
		)
	}

	if (!isSignedIn && isSigningIn) {
		return (
			<div style={{ marginTop: '2rem' }}>
				<Spinner />
			</div>
		)
	}

	return <Navigate to="/" replace />
}

function filterIsArchived(files: IFile[]) {
	return files.filter(file => isArchived(file))
}

export default ArchivePage
export { ArchivePage }
