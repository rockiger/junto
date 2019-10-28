import React, { useGlobal, useEffect, useRef, useState } from 'reactn'
import useDimensions from 'react-use-dimensions'

import { IconButton, InputBase, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from 'mdi-react/SearchIcon'
import CloseIcon from 'mdi-react/CloseIcon'

import SearchAutocomplete from './SearchAutocomplete'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'

const Search = ({ clearSearch, submit }) => {
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
    const classes = useStyles()

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
            className={classes.search}
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
                className={classes.searchIcon}
                onClick={submit}
                size="small"
            >
                <SearchIcon />
            </IconButton>
            {isSearchFieldActive && (
                <IconButton
                    aria-label="Clear search"
                    className={classes.backIcon}
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
                        ? `${classes.inputRoot} ${classes.active}`
                        : classes.inputRoot,
                    input: classes.inputInput,
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
                    className={classes.searchIcon}
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

function useStyles() {
    const useStyles = makeStyles(theme => {
        return {
            search: {
                [theme.breakpoints.up('md')]: {
                    borderRadius: 8,
                    backgroundColor: '#f1f3f4',
                    flexGrow: 1,
                    display: 'flex',
                    height: theme.spacing(6),
                    marginRight: theme.spacing(2),
                    marginLeft: 0,
                    maxWidth: 720,
                    position: 'relative',
                    width: '100%',
                },
            },
            searchIcon: {
                marginTop: 1,
                marginLeft: 5,
                height: 40,
                width: 40,
                [theme.breakpoints.down('sm')]: {
                    display: 'none',
                    width: theme.spacing(7),
                    height: '100%',
                    [theme.breakpoints.up('md')]: {
                        marginTop: 0,
                        alignItems: 'center',
                    },
                    marginTop: 5,
                    position: 'absolute',
                    pointerEvents: 'none',
                    //display: 'flex',
                    justifyContent: 'center',
                },
            },
            inputRoot: {
                color: 'inherit',
                width: '100%',
            },
            active: {
                [theme.breakpoints.down('sm')]: {
                    width: '100vw',
                    height: 56,
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    background: 'white',
                    zIndex: 1000,
                    paddingLeft: 64,
                    boxShadow:
                        '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
                },
            },
            backIcon: {
                [theme.breakpoints.down('sm')]: {
                    left: 20,
                    position: 'fixed',
                    top: 12,
                    zIndex: 10001,
                },
                [theme.breakpoints.up('md')]: {
                    display: 'none',
                },
            },
            inputInput: {
                color: 'black',
                paddingBottom: theme.spacing(1),
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
                paddingTop: 6,
                transition: theme.transitions.create('width'),
                width: '100%',
            },
        }
    })
    return useStyles()
}
