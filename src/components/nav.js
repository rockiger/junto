import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import logo from '../static/logo.svg';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, InputBase, Paper } from '@material-ui/core';
import SearchIcon from 'mdi-react/SearchIcon'

const Nav = props => {
    const classes = useStyles();
    if (props.isSignedIn) {
        return (
            <AppBar className={classes.appBarSignedIn} color="default">
                <Paper className={classes.card}>
                    <Toolbar className={classes.toolbar} variant="dense">
                        <div className={classes.titleWrapper}>
                            <Link className={classes.logoWrapper} to="/">
                                <img className={classes.logo} src={logo} alt="App logo" />
                            </Link>
                            <Link className={classes.titleSignedIn} to="/">
                                <Typography color="textPrimary" variant="h6" noWrap>
                                    Wiki
                                </Typography>
                            </Link>
                        </div>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search Wiki" y
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'Search' }}
                            />
                        </div>
                        <div className={classes.grow} />
                        <div>
                            {props.children}
                        </div>
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
                            <img className={classes.logo} src={logo} alt="App logo" />
                        </Link>
                        <Link className={classes.title} to="/">
                            <Typography className={classes.title} color="textPrimary" variant="h6" noWrap>
                                Junto Wiki
                </Typography>
                        </Link>
                    </div>
                    <div className={classes.grow} />

                    <div>
                        {props.children}
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}
export default Nav;
Nav.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
}

function useStyles() {
    const useStyles = makeStyles(theme => {
        console.log(theme);

        return ({
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
                }
            },
            card: {
                marginBottom: theme.spacing(1),
                marginLeft: theme.spacing(2),
                marginRight: theme.spacing(2),
                marginTop: theme.spacing(1),
                [theme.breakpoints.up('md')]: {
                    margin: 0,
                    boxShadow: 'none',
                }
            },
            toolbar: {
                [theme.breakpoints.up('md')]: {
                    minHeight: 64,
                    paddingLeft: 20,
                    paddingRight: 20,

                }
            },
            menuButton: {
                paddingLeft: 0,
            },
            logoWrapper: {
            },
            logo: {
                maxHeight: 24,
                marginRight: theme.spacing(1.5),
                [theme.breakpoints.up('md')]: {
                    maxHeight: 40,
                }
            },
            titleWrapper: {
                display: 'flex',
                alignItems: 'center',
                [theme.breakpoints.up('md')]: {
                    width: 236,
                }
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
                width: theme.spacing(7),
                height: '100%',
                marginTop: 5,
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                [theme.breakpoints.up('md')]: {
                    marginTop: 0,
                    alignItems: 'center',
                },
            },
            inputRoot: {
                color: 'inherit',
                width: '100%',
            },
            inputInput: {
                padding: theme.spacing(1, 1, 1, 7),
                transition: theme.transitions.create('width'),
                width: '100%',
            },
        })
    })
    return useStyles();
};