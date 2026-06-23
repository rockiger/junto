// @ts-check
import _ from "lib/helper/globals";
import { useGlobal } from "reactn";

import FileListComponent from "./fileList-component";

export { FileList };
export default FileList;

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
 * @property {import('reactn/default').IFile[]} files
 * @property {SortBy | undefined} [sortBy]
 * @property {(sortBy: SortBy) => void} [setSortBy]
 * @property {string} [title]
 * @property {'reason-suggested' | 'date'} [tableMiddleColumn]
 * @property {import('reactn/default').IFile[]} [locationLookupFiles]
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
	tableMiddleColumn = "reason-suggested",
	locationLookupFiles,
}) {
	const [isFileListLoading] = useGlobal("isFileListLoading");
	const [isInitialFileListLoading] = useGlobal("isInitialFileListLoading");
	const [searchTerm] = useGlobal("searchTerm");
	const isLoading =
		_.isEmpty(files) &&
		(searchTerm ? isFileListLoading : isInitialFileListLoading);

	return (
		<FileListComponent
			emptyIcon={emptyIcon}
			emptyMessage={
				searchTerm ? "None of your files matched this search." : emptyMessage
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
	);
}
