import { Spinner } from "components/gsuite-components/"
import { Hint } from "components/gsuite-components/hint"
import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "components/gsuite-components/tabs"
import { PageView } from "components/Tracking"
import WikiList from "components/wiki-list"
import { LOCALSTORAGE_NAME } from "lib/constants"
import { filterIsNotArchived } from "lib/helper/globalStateHelper"
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'
import FileSearchIcon from "mdi-react/FileSearchIcon"
import { useIsDesktop } from "lib/hooks/useMediaQuery"
import { useEffect, useMemo } from "react"
import { SelectionIndicator } from 'react-aria-components'
import { useDispatch, useGlobal, useState } from "reactn"
import FileList from "./FileList"
import Search from 'components/app/header/search'
import { useNavigate } from '@tanstack/react-router'
import { Disclosure, DisclosureHeader, DisclosurePanel } from 'components/gsuite-components/disclosure'

const localStorageKey = `${LOCALSTORAGE_NAME}-sortBy`
const sortByLS = localStorage.getItem(localStorageKey)

type SortBy = "modifiedByMeTime" | "viewedByMeTime" | "sharedWithMeTime"
function Home({ isSignedIn, isSigningIn, isCreatingNewFile }: { isSignedIn: boolean, isSigningIn: boolean, isCreatingNewFile: boolean }) {


	const [files] = useGlobal("files")
	const isDesktop = useIsDesktop()
	const notArchivedFiles = useMemo(
		() => filterIsNotArchived(files),
		[files],
	)
	const [searchTerm, setSearchTerm] = useGlobal("searchTerm")
	const [sortBy, setSortBy] = useState(
		sortByLS &&
			(sortByLS === "modifiedByMeTime" || sortByLS === "viewedByMeTime")
			? sortByLS
			: "modifiedByMeTime",
	)


	const navigate = useNavigate()
	const [, setIsSearchFieldActive] = useGlobal("isSearchFieldActive")
	const [searchValue, setSearchValue] = useGlobal("searchValue")
	const clearSearch = useDispatch("clearSearchComplete")

	useEffect(() => {
		if (searchTerm) {
			PageView({ pathname: "/search" })
		} else {
			PageView({ pathname: "/home" })
		}
	}, [searchTerm])


	const setSortByAndLocalStorage = (sortBy: SortBy) => {
		setSortBy(sortBy)
		localStorage.setItem(localStorageKey, sortBy)
	}



	const submit = () => {
		setSearchTerm(searchValue)
		setIsSearchFieldActive(false)
		navigate({ to: isSignedIn ? '/home' : '/' })
	}


	if (isSignedIn && !isSigningIn && !isCreatingNewFile) {
		return (
			<>
				<div className="dashboard-inline-search hidden lg:flex lg:justify-center">
					<Search clearSearch={clearSearch} submit={submit} />
				</div>
				{!searchTerm && !isDesktop && (<Tabs className="w-full">
					<TabList
						aria-label="Tabs"
						className="bg-surface-container flex w-full justify-around sticky top-0 z-10 lg:static"
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
								files={notArchivedFiles}
								sortBy={sortBy as SortBy}
								setSortBy={setSortByAndLocalStorage}
							/>
						</TabPanel>
						<TabPanel id="wikis" className="flex items-center justify-center">
							<WikiList
								files={notArchivedFiles}
								isDashboard
								orderBy="date"
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>
				)}
				{!searchTerm && isDesktop && <div className="flex flex-col gap-4 pb-4 px-6 pt-20">
					<Disclosure className="grow" defaultExpanded>
						<DisclosureHeader>
							Wikis
						</DisclosureHeader>
						<DisclosurePanel>
							<WikiList
								files={notArchivedFiles}
								isDashboard
								orderBy="date"
							/>
						</DisclosurePanel>
					</Disclosure>
					<Disclosure className="grow" defaultExpanded>
						<DisclosureHeader>
							Notes
						</DisclosureHeader>
						<DisclosurePanel>
							<FileList
								emptyIcon={FileDocumentIcon}
								emptyMessage="Your archive is empty."
								emptySubline="The archive will show pages you archived"
								files={notArchivedFiles}
								sortBy={"viewedByMeTime" as SortBy}
							/>
						</DisclosurePanel>
					</Disclosure>
				</div>}
				{/*{!searchTerm && (
					<Hint id="dashboard" scope="dashboard">
					<h1
						className={clsx(
							"m-0 border-b border-edge-strong px-2 py-2 text-2xl font-normal max-[949px]:hidden",
						)}
					>
						{searchTerm ? "Search results" : "Dashboard"}
					</h1>
				</Hint> */}
				{searchTerm && (
					<FileList
						emptyIcon={FileSearchIcon}
						emptyMessage={
							searchTerm
								? "None of your pages matched this search."
								: "There are no pages in this view."
						}
						emptySubline={
							searchTerm ? "Try another search with a broader keyword." : ""
						}
						files={files}
						header="h2"
						sortBy={sortBy as SortBy}
						setSortBy={setSortByAndLocalStorage}
						title={searchTerm ? "" : "Pages"}
					/>
				)}
			</>
		)
	}

	return (
		<div style={{ marginTop: "2rem" }}>
			<Spinner />
		</div>
	)
}

export default Home
