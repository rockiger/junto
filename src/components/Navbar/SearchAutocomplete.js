import React, { useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import clsx from 'clsx'

import FileDocumentIcon from 'mdi-react/FileDocumentIcon'

import { getTitleFromFile, sortByDate } from 'lib/helper'

import styles from './search-autocomplete.module.scss'

export const SearchAutocomplete = ({
    clearSearch,
    files,
    filteredFiles,
    height,
    history,
    searchValue,
    selectedRow,
    setFilteredFiles,
    setSubmitSelected,
    submitSelected,
}) => {
    useEffect(() => {
        setFilteredFiles(
            files
                .filter(file =>
                    file.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .sort((file1, file2) => {
                    let result = sortByDate(
                        file1.viewedByMeTime,
                        file2.viewedByMeTime
                    )

                    if (result === 0) {
                        result = sortByDate(
                            file1.modifiedByMe,
                            file2.modifiedByMe
                        )
                    }
                    return result
                })
        )
    }, [files, searchValue, setFilteredFiles])

    useEffect(() => {
        if (
            submitSelected &&
            selectedRow !== null &&
            filteredFiles.length >= selectedRow
        ) {
            history.push(`/page/${filteredFiles[selectedRow].id}`)
            clearSearch()
        }
        setSubmitSelected(false)
    }, [
        clearSearch,
        filteredFiles,
        history,
        selectedRow,
        setSubmitSelected,
        submitSelected,
    ])

    window.files = files
    if (filteredFiles.length < 1) return null
    return (
        <div
            elevation={1}
            className={styles.SearchAutocomplete}
            style={{
                top: height || 48,
            }}
        >
            <div
                class={styles.SearchAutocomplete_MenuList}
                id="SearchAutocomplete_MenuList"
            >
                {filteredFiles.slice(0, 7).map((file, index) => {
                    const filename = getTitleFromFile(file)
                    return (
                        <div
                            className={clsx(
                                styles.SearchAutocomplete_MenuItem,
                                index === selectedRow &&
                                    styles.SearchAutocomplete_MenuItem__selected
                            )}
                            key={file.id}
                            selected={index === selectedRow}
                        >
                            <Link
                                className={
                                    styles.SearcAutocomplete_MenuItem_Link
                                }
                                onClick={() => setTimeout(clearSearch, 100)}
                                to={`/page/${file.id}`}
                            >
                                <div
                                    className={
                                        styles.SearcAutocomplete_MenuItem_icon
                                    }
                                >
                                    <FileDocumentIcon />
                                </div>
                                <div>{filename}</div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default withRouter(SearchAutocomplete)
