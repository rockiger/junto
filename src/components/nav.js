import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getState } from '../state'

import logo from '../static/logo_48.svg'
import { makeStyles } from '@material-ui/core/styles'
import {
    AppBar,
    IconButton,
    InputBase,
    Paper,
    Typography,
    Toolbar,
} from '@material-ui/core'
import SearchIcon from 'mdi-react/SearchIcon'
import CloseIcon from 'mdi-react/CloseIcon'

const Nav = props => {
    const [{ isSearchFieldActive, searchTerm }, dispatch] = getState()
    const [searchValue, setSearchValue] = useState('')
    const classes = useStyles()

    useEffect(() => {
        if (searchValue !== searchTerm) setSearchValue(searchTerm)
    }, [searchTerm])

    const submit = () => {
        dispatch({
            type: 'SET_SEARCHTERM',
            payload: {
                searchTerm: searchValue,
            },
        })
        props.history.push('/')
    }

    const clearSearch = () => {
        setSearchValue(searchTerm)
        dispatch({
            type: 'SET_SEARCHTERM',
            payload: {
                searchTerm: '',
            },
        })
        dispatch({
            type: 'DEACTIVATE_SEARCH_FIELD',
        })
    }

    if (props.isSignedIn) {
        return (
            <AppBar className={classes.appBarSignedIn} color="default">
                <Paper className={classes.card}>
                    <Toolbar className={classes.toolbar} variant="dense">
                        <div className={classes.titleWrapper}>
                            <Link
                                className={classes.logoWrapper}
                                onClick={() => clearSearch()}
                                to="/"
                            >
                                <img
                                    className={classes.logo}
                                    src={logo}
                                    alt="App logo"
                                />
                            </Link>
                            <Link
                                className={classes.titleSignedIn}
                                onClick={() => clearSearch()}
                                to="/"
                            >
                                <Typography
                                    color="textPrimary"
                                    variant="h6"
                                    noWrap
                                >
                                    Wiki
                                </Typography>
                            </Link>
                        </div>
                        <Paper
                            className={classes.search}
                            elevation={isSearchFieldActive ? 1 : 0}
                            style={{
                                backgroundColor: isSearchFieldActive
                                    ? 'white'
                                    : null,
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
                                onClick={() =>
                                    dispatch({ type: 'ACTIVATE_SEARCH_FIELD' })
                                }
                                onFocus={() =>
                                    dispatch({ type: 'ACTIVATE_SEARCH_FIELD' })
                                }
                                onBlur={() =>
                                    dispatch({
                                        type: 'DEACTIVATE_SEARCH_FIELD',
                                    })
                                }
                                onChange={ev => setSearchValue(ev.target.value)}
                                onKeyDown={ev => {
                                    ev.stopPropagation()
                                    console.log(ev.key)
                                    if (ev.key === 'Enter') {
                                        submit()
                                    } else if (ev.key === 'Escape') {
                                        clearSearch()
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
                        </Paper>
                        <div className={classes.grow} />
                        <div>{props.children}</div>
                    </Toolbar>
                </Paper>
            </AppBar>
        )
    } else {
        return (
            <AppBar className={classes.appBar} color="default">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.titleWrapper}>
                        <Link className={classes.logoWrapper} to="/">
                            <img
                                className={classes.logo}
                                src={logo}
                                alt="App logo"
                            />
                        </Link>
                        <Link className={classes.title} to="/">
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                variant="h6"
                                noWrap
                            >
                                Junto Wiki
                            </Typography>
                        </Link>
                    </div>
                    <div className={classes.grow} />

                    <div>{props.children}</div>
                </Toolbar>
            </AppBar>
        )
    }
}
export default withRouter(Nav)
Nav.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
}

function useStyles() {
    const useStyles = makeStyles(theme => {
        return {
            grow: {
                flexGrow: 1,
            },
            appBar: {
                background: 'white',
                borderBottom: `1px solid ${theme.palette.grey['A100']}`,
                boxShadow: 'none',
            },
            appBarSignedIn: {
                background: 'white',
                boxShadow: 'none',
                [theme.breakpoints.up('md')]: {
                    borderBottom: `1px solid ${theme.palette.grey['A100']}`,
                },
            },
            card: {
                marginBottom: theme.spacing(1),
                marginLeft: theme.spacing(2),
                marginRight: theme.spacing(2),
                marginTop: theme.spacing(1),
                [theme.breakpoints.up('md')]: {
                    margin: 0,
                    boxShadow: 'none',
                },
            },
            toolbar: {
                [theme.breakpoints.up('md')]: {
                    minHeight: 64,
                    paddingLeft: 20,
                    paddingRight: 20,
                },
            },
            menuButton: {
                paddingLeft: 0,
            },
            logoWrapper: {},
            logo: {
                maxHeight: 24,
                marginRight: theme.spacing(1.5),
                [theme.breakpoints.up('md')]: {
                    maxHeight: 40,
                },
            },
            titleWrapper: {
                display: 'flex',
                alignItems: 'center',
                [theme.breakpoints.up('md')]: {
                    minWidth: 236,
                },
            },
            titleSignedIn: {
                display: 'none',
                [theme.breakpoints.up('md')]: {
                    display: 'block',
                    textDecoration: 'none',
                },
            },
            title: {
                display: 'block',
                textDecoration: 'none',
            },
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
