import React, { useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
    Paper,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import FileDocumentIcon from 'mdi-react/FileDocumentIcon'

import {
    getTitleFromFileName,
    getExtFromFileName,
    sortByDate,
} from 'lib/helper'
import { EXT } from 'lib/constants'

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
    const classes = useStyles()

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
            className={classes.root}
            style={{
                top: height ? height + 1 : 49,
            }}
        >
            <MenuList id="SearchAutocomplet__list">
                {filteredFiles.slice(0, 7).map((file, index) => {
                    const filename = getTitleFromFileName(file.name)
                    return (
                        <MenuItem
                            selected={index === selectedRow}
                            key={file.id}
                        >
                            <Link
                                className={classes.link}
                                onClick={() => setTimeout(clearSearch, 100)}
                                to={`/page/${file.id}`}
                            >
                                <ListItemIcon className={classes.icon}>
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

function useStyles() {
    const useStyles = makeStyles(theme => {
        return {
            root: {
                position: 'absolute',
                borderRadius: 8,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                flexDirection: 'column',
                flexGrow: 1,
                display: 'flex',
                marginRight: 16,
                marginLeft: 0,
                overflow: 'hidden',
                padding: '2px 4px',
                width: '100%',
                left: 0,
                [theme.breakpoints.down('sm')]: {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    height: 'calc(100vh - 46px)',
                    marginLeft: -theme.spacing(2),
                    width: '100vw',
                },
            },
            icon: {
                color: theme.palette.primary.main,
                //minWidth: theme.spacing(4),
            },
            link: {
                color: theme.palette.text.primary,
                display: 'flex',
                flexGrow: 1,
                textDecoration: 'none',
                alignItems: 'center',
            },
            listitem: {
                padding: 0,
                paddingRight: theme.spacing(2),
            },
        }
    })
    return useStyles()
}
