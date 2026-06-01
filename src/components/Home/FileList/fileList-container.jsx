// @ts-check
import { useGlobal } from "reactn";

import FileListComponent from "./fileList-component";

export { FileList };
export default FileList;

/** @typedef {'viewedByMeTime' | 'modifiedByMeTime' | 'sharedWithMeTime'} SortBy */

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
			sortBy={sortBy}
			title={title}
		/>
	);
}
