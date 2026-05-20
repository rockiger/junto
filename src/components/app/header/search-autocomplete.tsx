import { Link, useNavigate } from "@tanstack/react-router"
import clsx from "clsx"
import { Event } from "components/Tracking"
import { EXT } from "lib/constants"
import { getExtFromFileName, getTitleFromFile, sortByDate } from "lib/helper"
import FileDocumentIcon from "mdi-react/FileDocumentIcon"
import { type FC, useEffect } from "react"
import type { IFile } from "reactn/default"

export type SearchAutocompleteProps = {
    clearSearch: () => void
    files: IFile[]
    filteredFiles: IFile[]
    height?: number
    searchValue: string
    selectedRow: number | null
    setFilteredFiles: (files: IFile[]) => void
    setSubmitSelected: (v: boolean) => void
    submitSelected: boolean
    width?: number
}

export const SearchAutocomplete: FC<SearchAutocompleteProps> = ({
    clearSearch,
    files,
    filteredFiles,
    height = 48,
    searchValue,
    selectedRow,
    setFilteredFiles,
    setSubmitSelected,
    submitSelected,
}) => {
    const navigate = useNavigate()

    useEffect(() => {
        setFilteredFiles(
            files
                .filter((file) =>
                    file.name.toLowerCase().includes(searchValue.toLowerCase()),
                )
                .filter((file) => {
                    const ext = getExtFromFileName(file.name)
                    return ext === EXT
                })
                .sort((file1, file2) => {
                    let result = sortByDate(
                        file1.viewedByMeTime,
                        file2.viewedByMeTime,
                    )

                    if (result === 0) {
                        result = sortByDate(
                            (file1 as IFile & { modifiedByMe?: string })
                                .modifiedByMe,
                            (file2 as IFile & { modifiedByMe?: string })
                                .modifiedByMe,
                        )
                    }
                    return result
                }),
        )
    }, [files, searchValue, setFilteredFiles])

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

    if (filteredFiles.length < 1) return null

    return (
        <div
            className={clsx(
                "fixed left-0 top-16 w-full h-[calc(100vh-64px)]",
            )}
        >
            <div
                className="bg-surface-paper flex flex-col h-full"
                id="SearchAutocomplete_MenuList"
            >
                {filteredFiles.slice(0, 7).map((file, index) => {
                    const filename = getTitleFromFile(file)
                    return (
                        <Link
                            className={clsx(
                                "flex h-14 items-center no-underline",
                                "text-fg-default hover:bg-grey-200",
                                index === selectedRow && "bg-grey-200",
                            )}
                            key={file.id}
                            onClick={() => {
                                setTimeout(clearSearch, 100)
                                Event("Search", "Submit Selected", "click")
                            }}
                            to="/page/$id"
                            params={{ id: file.id }}
                        >
                            <div className="flex w-14 flex-col items-center text-accent">
                                <FileDocumentIcon />
                            </div>
                            <div className="flex flex-1 items-center">{filename}</div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchAutocomplete
