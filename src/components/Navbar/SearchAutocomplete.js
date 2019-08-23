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

import { getTitleFromFileName, getExtFromFilenName } from '../../lib/helper'
import { EXT } from '../../lib/constants'

const SearchAutocomplete = ({
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
                /* .sort(
                    (file1, file2) =>
                        file2.viewedByMeTime - file1.viewedByMeTime
                ) */
                .filter(file =>
                    file.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .filter(file => {
                    const ext = getExtFromFilenName(file.name)
                    return ext === EXT
                })
        )
    }, [files, searchValue, setFilteredFiles])

    useEffect(() => {
        console.log('submitSelected:', submitSelected)
        console.log(' selectedRow:', selectedRow)
        console.log('filteredFiles:', filteredFiles)
        if (
            submitSelected &&
            selectedRow !== null &&
            filteredFiles.length >= selectedRow
        ) {
            console.log('all three')
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
            style={{
                position: 'absolute',
                borderRadius: 8,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                flexDirection: 'column',
                flexGrow: 1,
                display: 'flex',
                marginRight: 16,
                marginLeft: 0,
                maxHeight: 400,
                maxWidth: width,
                overflow: 'hidden',
                padding: '2px 4px',
                width: '100%',
                top: height ? height + 1 : 49,
                left: 0,
            }}
        >
            <MenuList>
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
