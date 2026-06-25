// @ts-check
import _ from 'lib/helper/globals'
import { useFileTree } from 'lib/query/files-queries'
import { useRouterState } from '@tanstack/react-router'

import FileListComponent from './fileList-component'

export { FileList }
export default FileList

/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

/** @typedef {import('mdi-react').MdiReactIconComponentType} MdiReactIconComponentType */

/**
 * @typedef FileListProps
 * @property {MdiReactIconComponentType} [emptyIcon]
 * @property {string} [emptyMessage]
 * @property {string} [emptySubline]
 * @property {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [header]
 * @property {boolean} [isLoading]
 * @property {boolean} [isScrollable]
 * @property {import('types/app-state').IFile[]} files
 * @property {SortBy | undefined} [sortBy]
 * @property {(sortBy: SortBy) => void} [setSortBy]
 * @property {string} [title]
 * @property {'reason-suggested' | 'date'} [tableMiddleColumn]
 * @property {import('types/app-state').IFile[]} [locationLookupFiles]
 */

/**
 * @param {FileListProps} props
 */
function FileList({
	emptyIcon,
	emptyMessage,
	emptySubline,
	files,
	header,
	sortBy,
	setSortBy,
	title,
	tableMiddleColumn = 'reason-suggested',
	locationLookupFiles,
}) {
	const { isFetching, data: treeData } = useFileTree()
	const searchTerm = useRouterState({
		select: (s) => {
			const params = new URLSearchParams(s.location.searchStr)
			return params.get('q')?.trim() ?? ''
		},
	})
	const isLoading =
		_.isEmpty(files) && isFetching && !treeData?.length

	return (
		<FileListComponent
			emptyIcon={emptyIcon}
			emptyMessage={
				searchTerm ? 'None of your files matched this search.' : emptyMessage
			}
			emptySubline={emptySubline}
			files={files}
			header={header}
			isLoading={isLoading}
			searchTerm={searchTerm}
			setSortBy={setSortBy}
			sortBy={sortBy ?? 'modifiedByMeTime'}
			tableMiddleColumn={tableMiddleColumn}
			title={title}
			locationLookupFiles={locationLookupFiles}
		/>
	)
}
