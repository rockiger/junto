import { createLink, useNavigate } from "@tanstack/react-router"
import { ButtonMenu } from "components/ButtonMenu"
import { Spacer, Spinner } from "components/gsuite-components"
import { EXT, FOLDER_NAME, OVERVIEW_NAME } from "lib/constants"
import { useIsDesktop } from "lib/hooks/useMediaQuery"
import {
    getMetaById,
    getTitleFromFile,
    isWikiRootFolder,
    sortByDate,
} from "lib/helper"
import type { MdiReactIconComponentType } from "mdi-react"
import AccountMultipleOutlineIcon from "mdi-react/AccountMultipleOutlineIcon"
import FolderGoogleDriveIcon from 'mdi-react/FolderGoogleDriveIcon'
import FileDocumentIcon from "mdi-react/FileDocumentIcon"
import SortAlphabeticalIcon from "mdi-react/SortAlphabeticalVariantIcon"
import StarIcon from 'mdi-react/StarIcon'
import { createElement, useMemo } from "react"
import {
    Cell,
    Column,
    GridList,
    GridListItem,
    Row,
    Table,
    TableBody,
    TableHeader,
} from "react-aria-components"
import type { IFile } from "reactn/default"
import { EmptyPlaceholder } from "./EmptyPlaceHolder"

/** RAC {@link GridListItem} als TanStack-Router-Link ([createLink](https://tanstack.com/router/latest/docs/guide/custom-link)). */
const GridListItemLink = createLink(GridListItem)

export type SortBy = "modifiedByMeTime" | "sharedWithMeTime" | "viewedByMeTime"

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export type FileListTableMiddleColumn = 'reason-suggested' | 'date'

export type FileListComponentProps = {
    emptyIcon?: MdiReactIconComponentType
    emptyMessage?: string
    emptySubline?: string
    files: IFile[]
    header?: HeadingLevel
    isLoading?: boolean
    isScrollable?: boolean
    searchTerm: string
    setSortBy?: (sortBy: SortBy) => void
    sortBy: SortBy
    title?: string
    /** Full file tree for wiki/location labels; defaults to `files`. */
    locationLookupFiles?: IFile[]
    /** Home/Archive: reason text; Search/Starred/Shared: formatted date column. */
    tableMiddleColumn?: FileListTableMiddleColumn
}

function dedupeFilesById(files: IFile[]): IFile[] {
    const seen = new Set<string>()
    return files.filter(file => {
        if (seen.has(file.id)) {
            return false
        }
        seen.add(file.id)
        return true
    })
}

function sortDisplayFiles(files: IFile[], sortBy: SortBy): IFile[] {
    return dedupeFilesById(files)
        .filter(shouldFileDisplay)
        .sort((file1, file2) =>
            sortBy === "viewedByMeTime"
                ? sortByDate(file1.viewedByMeTime, file2.viewedByMeTime)
                : sortByDate(file1.modifiedByMeTime, file2.modifiedByMeTime),
        )
}

function buildLocationLabelByFileId(
    displayFiles: IFile[],
    locationLookupFiles: IFile[],
): Map<string, string> {
    const labels = new Map<string, string>()
    for (const file of displayFiles) {
        labels.set(file.id, getLocationLabel(file, locationLookupFiles))
    }
    return labels
}

export default function FileListComponent({
    emptyIcon,
    emptyMessage,
    emptySubline,
    files,
    header,
    isLoading,
    searchTerm,
    setSortBy,
    sortBy,
    title,
    locationLookupFiles,
    tableMiddleColumn = 'reason-suggested',
}: FileListComponentProps) {
    const headingTag = header ?? "h1"
    const isDesktop = useIsDesktop()

    if (searchTerm || title) {
        document.title = `${searchTerm ? "Search Result" : (title ?? "")} – Fulcrum.wiki`
    }

    const hasFiles = files.length > 0

    const displayFiles = useMemo(
        () => sortDisplayFiles(files, sortBy),
        [files, sortBy],
    )

    const lookupFiles = locationLookupFiles ?? files
    const locationLabelByFileId = useMemo(
        () => buildLocationLabelByFileId(files, lookupFiles),
        [files, lookupFiles],
    )

    return (
        <div className="filelist w-full">
            <div>
                {isLoading && <Spinner />}
                {!isLoading && hasFiles && !isDesktop && (
                    <FileListMobileView
                        displayFiles={displayFiles}
                        headingTag={headingTag}
                        setSortBy={setSortBy}
                        sortBy={sortBy}
                        title={title}
                    />
                )}
                {!isLoading && hasFiles && isDesktop && (
                    <FileListDesktopView
                        displayFiles={displayFiles}
                        headingTag={headingTag}
                        locationLabelByFileId={locationLabelByFileId}
                        setSortBy={setSortBy}
                        sortBy={sortBy}
                        tableMiddleColumn={tableMiddleColumn}
                        title={title}
                    />
                )}
                {files.length === 0 && !isLoading && (
                    <EmptyPlaceholder
                        icon={emptyIcon}
                        subline={emptySubline}
                        title={emptyMessage}
                    />
                )}
            </div>
            <style>{`
                    .filelist h1 {
                        border-bottom: 1px solid #dadce0;
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .5rem;
                    }
                    .filelist-list a {
                        border-radius: 66px;
                        color: #4285f4;
                        font-size: 1rem;
                        padding: .5rem 1rem .5rem .75rem;
                    }
                    .filelist-list a:hover {
                        background-color: #e8f0fe;
                        text-decoration: none;
                    }
                    .filelist-list a img, .filelist-list a span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                `}</style>
        </div>
    )
}

type FileListHeaderProps = {
    headingTag: HeadingLevel
    setSortBy?: (sortBy: SortBy) => void
    sortBy: SortBy
    title?: string
}

function FileListSortHeader({
    headingTag,
    setSortBy,
    sortBy,
    title,
}: FileListHeaderProps) {
    const sortLabel =
        sortBy === "viewedByMeTime"
            ? "Last opened by me"
            : sortBy === "sharedWithMeTime"
                ? "Shared with me"
                : "Last modified by me"

    return (
        <>
            {title ? (
                <>
                    {createElement(headingTag, {}, title)}
                    <Spacer />
                </>
            ) : null}
            {setSortBy ? (
                <div className="flex items-center">
                    <strong className="font-semibold mr-2 text-text-muted translate-y-px">
                        {sortLabel}
                    </strong>
                    <ButtonMenu
                        items={[
                            {
                                key: 1,
                                name: "Last modified by me",
                                handler: () => setSortBy("modifiedByMeTime"),
                                active: sortBy === "modifiedByMeTime",
                            },
                            {
                                key: 2,
                                name: "Last opened by me",
                                handler: () => setSortBy("viewedByMeTime"),
                                active: sortBy === "viewedByMeTime",
                            },
                        ]}
                        selectable={true}
                    >
                        <SortAlphabeticalIcon />
                    </ButtonMenu>
                </div>
            ) : null}
        </>
    )
}

type FileListMobileViewProps = FileListHeaderProps & {
    displayFiles: IFile[]
}

function FileListMobileView({
    displayFiles,
    headingTag,
    setSortBy,
    sortBy,
    title,
}: FileListMobileViewProps) {
    return (
        <GridList
            aria-label="Wiki pages"
            className="flex flex-col gap-0.5 px-2"
        >
            <GridListItem
                className="bg-surface-paper flex cursor-pointer rounded-b-lg rounded-t-2xl px-3 py-5 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus)"
                textValue={title ?? 'Wiki pages'}
            >
                <FileListSortHeader
                    headingTag={headingTag}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    title={title}
                />
            </GridListItem>
            {displayFiles.map((file) => (
                <GridListItemLink
                    key={file.id}
                    textValue={getTitleFromFile(file)}
                    className="bg-surface-paper flex cursor-pointer rounded-lg p-3 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus)"
                    preload="intent"
                    params={{ id: file.id }}
                    to="/page/$id"
                >
                    <div className="flex items-center justify-center pr-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-icon-surface">
                            <FileDocumentIcon className="text-icon-blue" size={30} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="text-lg">{getTitleFromFile(file)}</p>
                        <p className="flex font-medium text-sm text-text-muted">
                            {file.starred && (
                                <StarIcon className='inline h-3 mr-1 translate-y-0.75 w-3' />
                            )}
                            {formatFileModifiedCaption(file.modifiedTime)}
                        </p>
                    </div>
                </GridListItemLink>
            ))}
        </GridList>
    )
}

type FileListDesktopViewProps = FileListHeaderProps & {
    displayFiles: IFile[]
    locationLabelByFileId: Map<string, string>
    tableMiddleColumn: FileListTableMiddleColumn
}

function FileListDesktopView({
    displayFiles,
    headingTag,
    locationLabelByFileId,
    setSortBy,
    sortBy,
    tableMiddleColumn,
    title,
}: FileListDesktopViewProps) {
    const navigate = useNavigate()
    const middleColumnLabel =
        tableMiddleColumn === 'reason-suggested'
            ? 'Reason suggested'
            : sortBy === 'viewedByMeTime'
              ? 'Date opened'
              : 'Date modified'

    return (
        <div className="w-full px-2">
            {(title || setSortBy) && (
                <div className="bg-surface-paper mb-1 flex items-center rounded-t-2xl px-3 py-5">
                    <FileListSortHeader
                        headingTag={headingTag}
                        setSortBy={setSortBy}
                        sortBy={sortBy}
                        title={title}
                    />
                </div>
            )}
            <Table
                aria-label="Wiki pages"
                className="w-full border-collapse border-none bg-surface-paper text-sm"
            >
                <TableHeader className="border-b border-divider">
                    <Column
                        className="px-3 py-2 text-left font-normal text-text-muted"
                        id="name"
                        isRowHeader
                    >
                        Name
                    </Column>
                    <Column
                        className="px-3 py-2 text-left font-normal text-text-muted"
                        id="date"
                    >
                        {middleColumnLabel}
                    </Column>
                    <Column
                        className="max-w-48 px-3 py-2 text-left font-normal text-text-muted"
                        id="location"
                    >
                        Location
                    </Column>
                </TableHeader>
                <TableBody items={displayFiles}>
                    {(file) => (
                        <Row
                            className="cursor-pointer outline-none last:[&>td]:border-b-0 hover:bg-surface-hover focus-visible:shadow-(--shadow-focus)"
                            id={file.id}
                            onAction={() => {
                                navigate({
                                    to: '/page/$id',
                                    params: { id: file.id },
                                })
                            }}
                            textValue={getTitleFromFile(file)}
                        >
                            <Cell className="border-b border-divider px-3 py-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <FileDocumentIcon
                                        className="text-icon-blue"
                                        size={22}
                                    />
                                    <span className="flex min-w-0 items-center gap-1.5 truncate text-text-default">
                                        {file.starred && (
                                            <StarIcon className="inline h-3 w-3 shrink-0 text-text-muted" />
                                        )}
                                        <span className="truncate">
                                            {getTitleFromFile(file)}
                                        </span>
                                        {file.shared && (
                                            <AccountMultipleOutlineIcon
                                                className="shrink-0 text-fg-muted"
                                                size={16}
                                            />
                                        )}
                                    </span>
                                </div>
                            </Cell>
                            <Cell className="border-b border-divider px-3 py-3 text-text-muted">
                                {tableMiddleColumn === 'reason-suggested'
                                    ? getReasonSuggestedCaption(sortBy, file)
                                    : getDateColumnCaption(sortBy, file)}
                            </Cell>
                            <Cell className="max-w-48 border-b border-divider px-3 py-3 text-text-muted">
                                <div className="flex min-w-0 items-center gap-2">
                                    <FolderGoogleDriveIcon
                                        className="shrink-0 text-fg-muted"
                                        size={18}
                                    />
                                    <span className="truncate">
                                        {locationLabelByFileId.get(file.id) ?? ""}
                                    </span>
                                </div>
                            </Cell>
                        </Row>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

type FormatFileModifiedCaptionOptions = {
    locale?: Intl.LocalesArgument
    now?: Date
}

/**
 * ISO-Zeitstempel (z. B. Google&nbsp;Drive `modifiedTime`) für die Dateiliste:
 * nur Uhrzeit (heute), „Gestern“/„Yesterday“ … (über `RelativeTimeFormat`), Datum ohne Jahr
 * (&gt;= 2 lokale Kalendertage, gleiches Jahr), sonst Datum mit Jahr.
 */
function formatFileModifiedCaption(
    modifiedTimeIso: string | undefined,
    options?: FormatFileModifiedCaptionOptions,
): string {
    const { locale, now = new Date() } = options ?? {}

    if (modifiedTimeIso === undefined || modifiedTimeIso === "") {
        return ""
    }

    const modified = new Date(modifiedTimeIso)
    if (Number.isNaN(modified.getTime())) {
        return modifiedTimeIso
    }

    const calendarDaysBehind = calendarDaysBehindLocal(now, modified)

    if (calendarDaysBehind < 0) {
        return new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(modified)
    }

    if (calendarDaysBehind === 0) {
        return new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(modified)
    }

    if (calendarDaysBehind === 1) {
        return new Intl.RelativeTimeFormat(locale, {
            numeric: "auto",
        }).format(-1, "day")
    }

    const sameCalendarYear = modified.getFullYear() === now.getFullYear()

    if (!sameCalendarYear) {
        return new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(modified)
    }

    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
    }).format(modified)
}

/**
 * Ganze Kalendertage, die `past` relativ zu `later` zurückliegt (lokaler Kalender).
 * `0` = selber Tag, `1` = gestern, …
 */
function calendarDaysBehindLocal(later: Date, past: Date): number {
    const laterStart = Date.UTC(
        later.getFullYear(),
        later.getMonth(),
        later.getDate(),
    )
    const pastStart = Date.UTC(
        past.getFullYear(),
        past.getMonth(),
        past.getDate(),
    )
    const msDay = 24 * 60 * 60 * 1000
    return Math.round((laterStart - pastStart) / msDay)
}

function shouldFileDisplay(file: IFile): boolean {
    const { mimeType, name, trashed } = file
    return (
        (mimeType === "application/json" && name.endsWith(EXT) && !trashed) ||
        ((mimeType as string) === "text/markdown" &&
            name.endsWith(".md") &&
            !trashed)
    )
}

function formatReasonSuggestedDate(
    iso: string | undefined,
): string {
    if (!iso) {
        return ""
    }
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) {
        return ""
    }
    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
    }).format(date)
}

function getDateColumnCaption(sortBy: SortBy, file: IFile): string {
    const timeIso =
        sortBy === 'viewedByMeTime'
            ? file.viewedByMeTime
            : file.modifiedByMeTime ?? file.modifiedTime
    return formatFileModifiedCaption(timeIso)
}

function getReasonSuggestedCaption(sortBy: SortBy, file: IFile): string {
    let action: string
    let timeIso: string | undefined

    if (sortBy === "viewedByMeTime") {
        action = "You opened"
        timeIso = file.viewedByMeTime
    } else if (sortBy === "sharedWithMeTime") {
        action = "Shared with you"
        timeIso =
            typeof file.sharedWithMeTime === "string"
                ? file.sharedWithMeTime
                : file.modifiedByMeTime
    } else {
        action = "You modified"
        timeIso = file.modifiedByMeTime
    }

    const date = formatReasonSuggestedDate(timeIso)
    return date ? `${action} • ${date}` : action
}

function getLocationLabel(file: IFile, files: IFile[]): string {
    let current: IFile | undefined = file
    const visited = new Set<string>()

    while (current?.parents?.[0]) {
        if (visited.has(current.id)) {
            break
        }
        visited.add(current.id)
        const parent = getMetaById(current.parents[0], files)
        if (!parent) {
            break
        }

        if (isWikiRootFolder(parent)) {
            return getWikiDisplayName(parent, files)
        }

        if (parent.name === FOLDER_NAME) {
            const overview = files.find(
                (el) =>
                    el.name === OVERVIEW_NAME &&
                    el.parents?.includes(parent.id),
            )
            return overview ? getTitleFromFile(overview) : ""
        }

        current = parent
    }

    return ""
}

function getWikiDisplayName(wikiRootFolder: IFile, files: IFile[]): string {
    const overview = files.find(
        (el) =>
            el.name === OVERVIEW_NAME &&
            el.parents?.includes(wikiRootFolder.id),
    )

    const pageName = overview?.properties?.pageName
    if (typeof pageName === "string" && pageName.length > 0) {
        return pageName
    }

    return getTitleFromFile(wikiRootFolder) || wikiRootFolder.name
}
