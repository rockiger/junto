import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import logo from '../static/logo.svg';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Card, Toolbar, IconButton, Typography, InputBase, Paper } from '@material-ui/core';
import MenuIcon from 'mdi-react/MenuIcon'
import SearchIcon from 'mdi-react/SearchIcon'
import MailIcon from 'mdi-react/MailIcon'
import NotificationsIcon from 'mdi-react/NotificationsIcon'
import LogoutVariantIcon from 'mdi-react/LogoutVariantIcon'

const Nav = props => {
    const classes = useStyles();
    if (props.isSignedIn) {
        return (
            <AppBar className={classes.appBarSignedIn} color="default">
                <Paper className={classes.card}>
                    <Toolbar variant="dense">
                        <Link className={classes.logoWrapper} to="/">
                            <IconButton
                                edge="inherit"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="Open drawer"
                            >
                                <img className={classes.logo} src={logo} alt="App logo" />
                            </IconButton>
                        </Link>
                        <Link to="/">
                            <Typography className={classes.title} variant="h6" noWrap>
                                Wiki
                            </Typography>
                        </Link>
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
            <Toolbar>
                <div className={classes.logoWrapper}>
                    <img className={classes.logo} src={logo} alt="App logo" />
                </div>

                <Typography  color="textSecondary" variant="h6" noWrap>
                    Junto Wiki
                </Typography>

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
        },
        card: {
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        menuButton: {
            paddingLeft: 0,
        },
        logoWrapper: {
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(2),
        },
        logo: {
            maxHeight: 24,
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            flexGrow: 1,
        },
        searchIcon: {
            width: theme.spacing(7),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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


/*
<Link to="/">
<span className="Nav-logo">
    <img src={logo} alt="Logo" />
    <span className="Nav-logo-name">Awiki</span>
</span>
</Link>
<div className="Nav-search">
{props.isSignedIn && <div className="Nav-search-form"><input placeholder="Search Awiki (Mockup)" /></div>}
</div>
<div className="Nav-user">{props.children}</div>
<style>{`
:global(body) {
    margin: 0;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont,
        Avenir Next, Avenir, Helvetica, sans-serif;
}
:global(main) {
    margin-top: 64px;
}
.Nav {
    position: fixed;
    top: 0;
    display: flex;
    padding: 8px 16px;
    font: 13px/27px Roboto, RobotoDraft, Arial, sans-serif;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    border-bottom: 1px solid #dadce0;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    z-index: 1000;
}
.Nav-logo {
    height: 48px;
    min-width: 238px;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    display: flex;
    align-items: center;
}
.Nav-logo img {
    max-height: 48px;
}
.Nav-logo-name {
    display: inline-block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    font-size: 22px;
    vertical-align: middle;
    color: #5f6368;
    line-height: 24px;
    padding-left: 4px;
}
.Nav-search {
    display: flex;
    height: 48px;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 100%;
}
.Nav-search-form {
    background: #f1f3f4;
    border: 1px solid transparent;
    -webkit-border-radius: 8px;
    border-radius: 8px;
    display: flex;
    flex: 1 1 auto;
    margin-right: auto;
    max-width: 720px;
    padding-left: 10px;
    padding-right: 30px;
    position: relative;
    -webkit-transition: background 100ms ease-in,width 100ms ease-out;
    transition: background 100ms ease-in,width 100ms ease-out;
}
.Nav-search-form input {
    background-color: #f1f3f4;
    border: none;
    font-size: 1rem;
    margin-left: 46px;
}
.Nav-user {
    height: 48px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 1rem;
}
.Nav ul {
    display: flex;
    justify-content: space-between;
}
.Nav > ul {
    padding: 4px 16px;
}
.Nav li {
    display: flex;
    padding: 6px 8px;
}
.Nav a {
    color: #067df7;
    text-decoration: none;
    font-size: 13px;
}
`}</style> */

