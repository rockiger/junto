import clsx from "clsx"
import IconButton from "components/gsuite-components/icon-button"
import { Event } from "components/Tracking"

import ArrowLeftIcon from "mdi-react/ArrowLeftIcon"
import CloseIcon from "mdi-react/CloseIcon"
import { useIsDesktop } from "lib/hooks/useMediaQuery"
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from 'react-aria-components'
import useDimensions from "react-use-dimensions"
import { useGlobal } from "reactn"
import SearchAutocomplete, {
    filterSearchAutocompleteFiles,
} from "./search-autocomplete"

export type SearchProps = {
    clearSearch: () => void
    submit: () => void
    className?: string
}

export const Search: FC<SearchProps> = ({ clearSearch, submit, className }) => {
    const isDesktop = useIsDesktop()
    const [files] = useGlobal("files")
    const [isSearchFieldActive, setIsSearchFieldActive] = useGlobal(
        "isSearchFieldActive",
    )
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useGlobal("searchValue")

    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [submitSelected, setSubmitSelected] = useState(false)
    const filteredFiles = useMemo(
        () => filterSearchAutocompleteFiles(files, searchValue),
        [files, searchValue],
    )

    const [searchRef, { height, width }] = useDimensions()
    const inputRef = useRef<HTMLInputElement>(null)

    const activateSearch = useCallback((kind: string) => {
        setIsSearchFieldActive(true)
        setShowSearch(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
        Event("Search", "Activate search", kind)
    }, [setIsSearchFieldActive])

    useEffect(() => {
        if (!isSearchFieldActive) setSelectedRow(null)
    }, [isSearchFieldActive])

    useEffect(() => {
        function onKeyDown(ev: KeyboardEvent) {
            if (ev.key === "/" && !isSearchFieldActive) {
                ev.stopPropagation()
                ev.preventDefault()
                activateSearch("keydown /")
                inputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", onKeyDown)

        return function cleanup() {
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [activateSearch, isSearchFieldActive])


    if (!isDesktop && !showSearch) {
        return (
            <Button
                aria-label="Open search"
                className={clsx(
                    "bg-search-bg font-normal rounded-full text-base text-search-placeholder w-full h-13",
                    className,
                )}
                onPress={() => activateSearch("click")}
            >
                <div className="translate-y-[2px]">Search in Fulcrum</div>
            </Button>
        )
    }
    return (
        <div
            className={clsx(
                "flex flex-1",
                "max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-1000 max-lg:h-16 max-lg:w-full max-lg:bg-surface max-lg:pt-1 max-lg:px-1",
                "lg:relative lg:h-12 lg:w-full lg:max-w-[832px] lg:items-center lg:rounded-full lg:bg-search-bg lg:px-4",
                className,
            )}
            ref={searchRef}
        >
            <div className="flex w-14 flex-col px-[5px] pt-px lg:hidden">
                {/* <IconButton
                    ariaLabel="Search"
                    className={clsx(
                        "mt-px ml-[5px] h-10 w-10",
                    )}
                    onClick={() => submitSearch("click")}
                >
                    <SearchIcon />
                </IconButton> */}

                <IconButton
                    ariaLabel="Clear search"
                    className=""
                    onClick={() => {
                        setSearchValue("")
                        setShowSearch(false)
                    }}
                >
                    <ArrowLeftIcon />
                </IconButton>
            </div>
            <div className="flex flex-1 flex-col items-start">
                <input
                    name="search-input"
                    aria-label="Search in Fulcrum"
                    placeholder="Search in Fulcrum"
                    className={clsx(
                        "w-full border-0 bg-transparent p-0 font-inherit placeholder-search-placeholder text-base text-fg-default outline-none pt-2.5 lg:pt-0",
                    )}
                    onClick={() => activateSearch("click")}
                    onFocus={() => activateSearch("focus")}
                    onBlur={() =>
                        setTimeout(() => setIsSearchFieldActive(false), 100)
                    }
                    onChange={(ev) => {
                        setSearchValue(ev.target.value)
                        setSelectedRow(null)
                    }}
                    onKeyDown={(ev) => {
                        const border = Math.min(6, filteredFiles.length - 1)
                        if (ev.key === "Enter") {
                            ev.preventDefault()
                            if (selectedRow === null) {
                                submitSearch("keydown Enter")
                            } else {
                                setSubmitSelected(true)
                            }
                        } else if (ev.key === "Escape") {
                            ev.preventDefault()
                            clearSearch()
                            setShowSearch(false)
                        } else if (ev.key === "ArrowDown") {
                            ev.preventDefault()
                            if (filteredFiles.length < 1) {
                                setSelectedRow(null)
                            } else if (selectedRow === null) {
                                setSelectedRow(0)
                            } else if (selectedRow === border) {
                                setSelectedRow(null)
                            } else {
                                setSelectedRow(selectedRow + 1)
                            }
                        } else if (ev.key === "ArrowUp") {
                            ev.preventDefault()
                            if (filteredFiles.length < 1) {
                                setSelectedRow(null)
                            } else if (selectedRow === null) {
                                setSelectedRow(border)
                            } else if (selectedRow === 0) {
                                setSelectedRow(null)
                            } else {
                                setSelectedRow(selectedRow - 1)
                            }
                        } else if (isSearchFieldActive) {
                            ev.stopPropagation()
                        }
                    }}
                    readOnly={!isDesktop && !isSearchFieldActive}
                    ref={inputRef}
                    value={searchValue}
                />
            </div>
            <div className="flex w-[49px] flex-col items-center lg:hidden">
                {searchValue ? (
                    <IconButton
                        ariaLabel="Clear search"
                        onClick={() => setTimeout(() => {
                            clearSearch()
                            setSearchValue("")
                            inputRef.current?.focus()

                        }, 100)
                        }
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </div>
            {!isDesktop && isSearchFieldActive ? (
                <div
                    className={clsx(
                        "pointer-events-none absolute top-14 left-0 h-[calc(100vh-56px)] w-screen bg-surface",
                    )}
                />
            ) : null}
            {isSearchFieldActive ? (
                <SearchAutocomplete
                    clearSearch={clearSearch}
                    filteredFiles={filteredFiles}
                    height={height}
                    selectedRow={selectedRow}
                    setSubmitSelected={setSubmitSelected}
                    submitSelected={submitSelected}
                    width={width}
                />
            ) : null}
        </div>
    )

    function submitSearch(kind: string) {
        submit()
        Event("Search", "Submit search", kind)
    }
}

export default Search
