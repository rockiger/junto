import { createLink } from "@tanstack/react-router"
import { ButtonMenu } from "components/ButtonMenu"
import { Spacer, Spinner } from "components/gsuite-components"
import { EXT } from "lib/constants"
import { getTitleFromFile, sortByDate } from "lib/helper"
import type { MdiReactIconComponentType } from "mdi-react"
import FileDocumentIcon from "mdi-react/FileDocumentIcon"
import SortAlphabeticalIcon from "mdi-react/SortAlphabeticalVariantIcon"
import StarIcon from 'mdi-react/StarIcon'
import { createElement } from "react"
import { GridList, GridListItem } from "react-aria-components"
import type { IFile } from "reactn/default"
import { EmptyPlaceholder } from "./EmptyPlaceHolder"

/** RAC {@link GridListItem} als TanStack-Router-Link ([createLink](https://tanstack.com/router/latest/docs/guide/custom-link)). */
const GridListItemLink = createLink(GridListItem)

export type SortBy = "modifiedByMeTime" | "sharedWithMeTime" | "viewedByMeTime"

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

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
}: FileListComponentProps) {
    const headingTag = header ?? "h1"

    if (searchTerm || title) {
        document.title = `${searchTerm ? "Search Result" : (title ?? "")} – Fulcrum.wiki`
    }

    const hasFiles = files.length > 0

    return (
        <div className="filelist">
            <div>
                {isLoading && <Spinner />}
                {!isLoading && hasFiles && (
                    <GridList
                        aria-label="Wiki pages"
                        className="flex flex-col gap-0.5 px-2"
                    >
                        <GridListItem className="bg-surface-paper flex cursor-pointer rounded-b-lg rounded-t-2xl px-3 py-5 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus)">
                            {title ? (
                                <>
                                    {createElement(headingTag, {}, title)}
                                    <Spacer />
                                </>
                            ) : null}
                            {setSortBy ? (
                                <div className="flex items-center">
                                    <strong className="font-semibold mr-2 text-text-muted translate-y-px"
                                    >
                                        {sortBy === "viewedByMeTime"
                                            ? "Last opened by me"
                                            : "Last modified by me"}
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
                        </GridListItem>
                        {files
                            .filter(shouldFileDisplay)
                            .sort((file1, file2) =>
                                sortBy === "viewedByMeTime"
                                    ? sortByDate(file1.viewedByMeTime, file2.viewedByMeTime)
                                    : sortByDate(file1.modifiedByMeTime, file2.modifiedByMeTime),
                            )
                            .map((file) => (
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
