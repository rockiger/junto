import React, { useState } from 'react'
import useDimensions from 'react-use-dimensions'

import { IconButton, InputBase, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from 'mdi-react/SearchIcon'
import CloseIcon from 'mdi-react/CloseIcon'

import { getState } from '../../state'

import SearchAutocomplete from './SearchAutocomplete'

const Search = ({
    clearSearch,
    dispatch,
    isSearchFieldActive,
    searchValue,
    setSearchValue,
    submit,
}) => {
    const [{ files }] = getState()
    const [searchRef, { height, width }] = useDimensions()
    const [selectedRow, setSelectedRow] = useState(null)
    const [submitSelected, setSubmitSelected] = useState(false)
    const [filteredFiles, setFilteredFiles] = useState(files)
    const classes = useStyles()

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
            <InputBase
                placeholder="Search Wiki"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'Search' }}
                onClick={() => dispatch({ type: 'ACTIVATE_SEARCH_FIELD' })}
                onFocus={() => dispatch({ type: 'ACTIVATE_SEARCH_FIELD' })}
                onBlur={() =>
                    setTimeout(
                        () =>
                            dispatch({
                                type: 'DEACTIVATE_SEARCH_FIELD',
                            }),
                        1000
                    )
                }
                onChange={ev => {
                    setSearchValue(ev.target.value)
                    setSelectedRow(null)
                    console.log('onchange:', setSearchValue)
                }}
                onKeyDown={ev => {
                    ev.stopPropagation()
                    console.log(ev.key)
                    const border = Math.min(6, filteredFiles.length - 1)
                    if (ev.key === 'Enter') {
                        if (selectedRow === null) {
                            submit()
                        } else {
                            setSubmitSelected(true)
                        }
                    } else if (ev.key === 'Escape') {
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
                    }
                }}
                readOnly={!isSearchFieldActive}
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
                    width: theme.spacing(7),
                    height: '100%',
                    [theme.breakpoints.up('md')]: {
                        marginTop: 0,
                        alignItems: 'center',
                    },
                    marginTop: 5,
                    position: 'absolute',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                },
            },
            inputRoot: {
                color: 'inherit',
                width: '100%',
            },
            inputInput: {
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
