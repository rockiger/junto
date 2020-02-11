import React, { useGlobal, useEffect, useRef, useState } from 'reactn'
import useDimensions from 'react-use-dimensions'

import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from 'mdi-react/SearchIcon'
import CloseIcon from 'mdi-react/CloseIcon'

import SearchAutocomplete from './SearchAutocomplete'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'

import styles from './search.module.scss'

export const Search = ({ clearSearch, submit }) => {
    const [files] = useGlobal('files')
    const [isSearchFieldActive, setIsSearchFieldActive] = useGlobal(
        'isSearchFieldActive'
    )
    const [searchValue, setSearchValue] = useGlobal('searchValue')

    const [selectedRow, setSelectedRow] = useState(null)
    const [submitSelected, setSubmitSelected] = useState(false)
    const [filteredFiles, setFilteredFiles] = useState(files)

    const [searchRef, { height, width }] = useDimensions()
    const inputRef = useRef(null)

    useEffect(() => {
        if (!isSearchFieldActive) setSelectedRow(null)
    }, [isSearchFieldActive])

    useEffect(() => {
        function onKeyDown(ev) {
            if (ev.key === '/' && !isSearchFieldActive) {
                ev.stopPropagation()
                ev.preventDefault()
                setIsSearchFieldActive(true)
                console.log('/')
                inputRef.current.click()
            }
        }
        window.addEventListener('keydown', onKeyDown)

        return function cleanup() {
            window.removeEventListener('keydown', onKeyDown)
        }
        // eslint-disable-next-line
    }, [isSearchFieldActive])

    return (
        <Paper
            className={styles.search}
            elevation={isSearchFieldActive ? 1 : 0}
            ref={searchRef}
            style={{
                backgroundColor: isSearchFieldActive ? 'white' : null,
                borderBottomLeftRadius:
                    isSearchFieldActive && filteredFiles.length > 0 ? 0 : null,
                borderBottomRightRadius:
                    isSearchFieldActive && filteredFiles.length > 0 ? 0 : null,
                padding: '2px 4px',
            }}
        >
            <IconButton
                aria-label="Search"
                className={styles.SearchIcon}
                onClick={submit}
                size="small"
            >
                <SearchIcon />
            </IconButton>
            {isSearchFieldActive && (
                <IconButton
                    aria-label="Clear search"
                    className={styles.backIcon}
                    onClick={clearSearch}
                    size="small"
                >
                    <ArrowLeftIcon />
                </IconButton>
            )}
            <InputBase
                placeholder="Search Fulcrum"
                classes={{
                    root: isSearchFieldActive
                        ? `${styles.input_root} ${styles.active}`
                        : styles.input_root,
                    input: styles.input_input,
                }}
                inputProps={{ 'aria-label': 'Search' }}
                onClick={() => setIsSearchFieldActive(true)}
                onFocus={() => setIsSearchFieldActive(true)}
                onBlur={() =>
                    setTimeout(() => setIsSearchFieldActive(false), 100)
                }
                onChange={ev => {
                    setSearchValue(ev.target.value)
                    setSelectedRow(null)
                }}
                onKeyDown={ev => {
                    const border = Math.min(6, filteredFiles.length - 1)
                    if (ev.key === 'Enter') {
                        ev.preventDefault()
                        if (selectedRow === null) {
                            submit()
                        } else {
                            setSubmitSelected(true)
                        }
                    } else if (ev.key === 'Escape') {
                        ev.preventDefault()
                        clearSearch()
                    } else if (ev.key === 'ArrowDown') {
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
                    } else if (ev.key === 'ArrowUp') {
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
                    } else {
                        if (isSearchFieldActive) ev.stopPropagation()
                    }
                }}
                readOnly={!isSearchFieldActive}
                ref={inputRef}
                value={searchValue}
            />
            {searchValue && (
                <IconButton
                    aria-label="Clear search"
                    className={styles.SearchIcon}
                    onClick={clearSearch}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            )}
            {isSearchFieldActive && (
                <SearchAutocomplete
                    clearSearch={clearSearch}
                    height={height}
                    files={files}
                    filteredFiles={filteredFiles}
                    searchValue={searchValue}
                    selectedRow={selectedRow}
                    setFilteredFiles={setFilteredFiles}
                    setSubmitSelected={setSubmitSelected}
                    submitSelected={submitSelected}
                    width={width}
                />
            )}
        </Paper>
    )
}

export default Search
