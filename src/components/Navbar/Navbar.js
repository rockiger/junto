import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getState } from '../../state'

import logo from '../../static/logo_48.svg'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Paper, Typography, Toolbar } from '@material-ui/core'

import Search from './Search'

const Navbar = props => {
    const [{ isSearchFieldActive, searchTerm }, dispatch] = getState()
    const [searchValue, setSearchValue] = useState('')

    const classes = useStyles()

    useEffect(() => {
        if (searchValue !== searchTerm) setSearchValue(searchTerm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    const submit = () => {
        dispatch({
            type: 'SET_SEARCHTERM',
            payload: {
                searchTerm: searchValue,
            },
        })
        dispatch({
            type: 'DEACTIVATE_SEARCH_FIELD',
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
                                    Fulcrum
                                </Typography>
                            </Link>
                        </div>
                        <Search
                            clearSearch={clearSearch}
                            dispatch={dispatch}
                            isSearchFieldActive={isSearchFieldActive}
                            searchValue={searchValue}
                            setSearchValue={val => setSearchValue(val)}
                            submit={submit}
                        />
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
                                Fulcrum Wiki
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
export default withRouter(Navbar)
Navbar.propTypes = {
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
                color: '#5f6368',
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
        }
    })
    return useStyles()
}
