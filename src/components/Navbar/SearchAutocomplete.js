import React, { useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
    Paper,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
} from '@material-ui/core'

import FileDocumentIcon from 'mdi-react/FileDocumentIcon'

import { getTitleFromFile, getExtFromFileName, sortByDate } from 'lib/helper'
import { EXT } from 'lib/constants'

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
    width,
}) => {
    useEffect(() => {
        setFilteredFiles(
            files
                .filter(file =>
                    file.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .filter(file => {
                    const ext = getExtFromFileName(file.name)
                    return ext === EXT
                })
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
        <Paper
            elevation={1}
            className={styles.root}
            style={{
                top: height ? height + 1 : 49,
            }}
        >
            <MenuList id="SearchAutocomplet__list">
                {filteredFiles.slice(0, 7).map((file, index) => {
                    const filename = getTitleFromFile(file)
                    return (
                        <MenuItem
                            className={styles.MenuItem}
                            key={file.id}
                            selected={index === selectedRow}
                        >
                            <Link
                                className={styles.link}
                                onClick={() => setTimeout(clearSearch, 100)}
                                to={`/page/${file.id}`}
                            >
                                <ListItemIcon className={styles.icon}>
                                    <FileDocumentIcon />
                                </ListItemIcon>
                                <ListItemText primary={filename} />
                            </Link>
                        </MenuItem>
                    )
                })}
            </MenuList>
        </Paper>
    )
}

export default withRouter(SearchAutocomplete)
