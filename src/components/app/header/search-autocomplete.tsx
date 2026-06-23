import { Link, useNavigate } from "@tanstack/react-router"
import clsx from "clsx"
import { Event } from "components/Tracking"
import { getTitleFromFile, sortByDate } from "lib/helper"
import { isWikiPageForSearch } from "lib/search/search-helper"
import ArrowLeftIcon from "mdi-react/ArrowLeftIcon"
import FileDocumentIcon from "mdi-react/FileDocumentIcon"
import { type FC, type ReactNode, useEffect } from "react"
import type { IFile } from "reactn/default"

export { isWikiPageForSearch } from "lib/search/search-helper"

export function filterSearchAutocompleteFiles(
    files: IFile[],
    searchValue: string,
): IFile[] {
    const query = searchValue.toLowerCase()
    return files
        .filter(isWikiPageForSearch)
        .filter((file) => file.name.toLowerCase().includes(query))
        .sort((file1, file2) => {
            let result = sortByDate(
                file1.viewedByMeTime,
                file2.viewedByMeTime,
            )

            if (result === 0) {
                result = sortByDate(
                    (file1 as IFile & { modifiedByMe?: string }).modifiedByMe,
                    (file2 as IFile & { modifiedByMe?: string }).modifiedByMe,
                )
            }
            return result
        })
}

function highlightQueryMatch(title: string, query: string): ReactNode {
    const trimmed = query.trim()
    if (!trimmed) {
        return title
    }
    const lowerTitle = title.toLowerCase()
    const lowerQuery = trimmed.toLowerCase()
    const parts: ReactNode[] = []
    let lastIndex = 0
    let searchFrom = 0

    while (searchFrom < title.length) {
        const index = lowerTitle.indexOf(lowerQuery, searchFrom)
        if (index === -1) {
            parts.push(title.slice(lastIndex))
            break
        }
        if (index > lastIndex) {
            parts.push(title.slice(lastIndex, index))
        }
        parts.push(
            <strong key={index}>{title.slice(index, index + trimmed.length)}</strong>,
        )
        lastIndex = index + trimmed.length
        searchFrom = lastIndex
    }

    return parts.length === 1 ? parts[0] : parts
}

function getSearchResultAuthor(file: IFile): string {
    return (
        file.lastModifyingUser?.displayName ??
        file.owners?.[0]?.displayName ??
        ""
    )
}

function formatSearchResultDate(modifiedTime: string | undefined): string {
    if (!modifiedTime) {
        return ""
    }
    const date = new Date(modifiedTime)
    if (Number.isNaN(date.getTime())) {
        return ""
    }
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
    }
    if (date.getFullYear() !== new Date().getFullYear()) {
        options.year = "numeric"
    }
    return new Intl.DateTimeFormat(undefined, options).format(date)
}

export type SearchAutocompleteProps = {
    clearSearch: () => void
    filteredFiles: IFile[]
    onSubmitSearch: () => void
    searchValue: string
    selectedRow: number | null
    setSubmitSelected: (v: boolean) => void
    submitSelected: boolean
}

export const SearchAutocomplete: FC<SearchAutocompleteProps> = ({
    clearSearch,
    filteredFiles,
    onSubmitSearch,
    searchValue,
    selectedRow,
    setSubmitSelected,
    submitSelected,
}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (
            submitSelected &&
            selectedRow !== null &&
            filteredFiles.length > selectedRow
        ) {
            navigate({
                to: "/page/$id",
                params: { id: filteredFiles[selectedRow].id },
            })
            clearSearch()
            Event("Search", "Submit Selected", "keydown Enter")
        }
        setSubmitSelected(false)
    }, [
        clearSearch,
        filteredFiles,
        navigate,
        selectedRow,
        setSubmitSelected,
        submitSelected,
    ])

    if (filteredFiles.length < 1) {
        return null
    }

    const results = filteredFiles.slice(0, 7)

    return (
        <div
            className={clsx(
                "fixed left-0 top-16 w-full h-[calc(100vh-64px)]",
                "lg:absolute lg:top-full lg:left-0 lg:z-50 lg:h-auto lg:max-h-none lg:w-full",
            )}
        >
            <div
                className={clsx(
                    "bg-surface-paper flex h-full flex-col",
                    "lg:border-b lg:border-x lg:border-edge-strong lg:rounded-b-3xl lg:shadow-md",
                )}
                id="SearchAutocomplete_MenuList"
                onMouseDown={(ev) => ev.preventDefault()}
            >
                {results.map((file, index) => {
                    const filename = getTitleFromFile(file)
                    const author = getSearchResultAuthor(file)
                    const dateLabel = formatSearchResultDate(file.modifiedTime)
                    const isSelected = index === selectedRow

                    return (
                        <Link
                            className={clsx(
                                "flex items-center no-underline text-fg-default hover:bg-grey-200",
                                "h-14",
                                "lg:gap-3 lg:px-2 lg:py-3",
                                isSelected && "bg-grey-200",
                            )}
                            key={file.id}
                            onClick={() => {
                                clearSearch()
                                Event("Search", "Submit Selected", "click")
                            }}
                            to="/page/$id"
                            params={{ id: file.id }}
                        >
                            <div className="flex w-14 shrink-0 flex-col items-center text-accent lg:w-10">
                                <FileDocumentIcon
                                    className="text-icon-blue"
                                    size={24}
                                />
                            </div>
                            <div className="flex flex-1 items-center lg:hidden">
                                {filename}
                            </div>
                            <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <span className="truncate text-base leading-snug">
                                        {highlightQueryMatch(filename, searchValue)}
                                    </span>
                                    <span className="truncate text-sm text-text-muted">
                                        {author}
                                    </span>
                                </div>
                                <span className="shrink-0 text-sm text-text-muted">
                                    {dateLabel}
                                </span>
                            </div>
                        </Link>
                    )
                })}
                <div
                    className={clsx(
                        "hidden border-t border-edge-strong lg:flex lg:items-center lg:justify-end lg:px-4 lg:py-3",
                    )}
                >
                    <button
                        className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-sm text-accent hover:underline"
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                            onSubmitSearch()
                            Event("Search", "All results", "click")
                        }}
                        type="button"
                    >
                        <ArrowLeftIcon size={16} />
                        All results
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchAutocomplete
