import React, { useDispatch, useEffect, useGlobal } from 'reactn'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import logo from '../../static/logo_48.svg'
import { AppBar, Paper, Typography, Toolbar } from '@material-ui/core'

import Search from './Search'

import styles from './navbar.module.scss'
console.log('styles', styles)

const Navbar = props => {
    const [, setIsSearchFieldActive] = useGlobal('isSearchFieldActive')
    const [searchTerm, setSearchTerm] = useGlobal('searchTerm')
    const [searchValue, setSearchValue] = useGlobal('searchValue')

    const clearSearch = useDispatch('clearSearch')

    useEffect(() => {
        if (searchValue !== searchTerm) setSearchValue(searchTerm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    const submit = () => {
        setSearchTerm(searchValue)
        setIsSearchFieldActive(false)
        props.history.push('/')
    }

    if (props.isSignedIn) {
        return (
            <AppBar className={styles.AppBar__signedIn} color="default">
                <Paper className={styles.card}>
                    <Toolbar className={styles.Toolbar} variant="dense">
                        <div className={styles.title_wrapper}>
                            <Link onClick={() => clearSearch()} to="/">
                                <img
                                    className={styles.logo}
                                    src={logo}
                                    alt="App logo"
                                />
                            </Link>
                            <Link
                                className={styles.title__signedIn}
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
                        <Search clearSearch={clearSearch} submit={submit} />
                        <div className={styles.grow} />
                        <div>{props.children}</div>
                    </Toolbar>
                </Paper>
            </AppBar>
        )
    } else {
        return (
            <AppBar className={styles.AppBar} color="default">
                <Toolbar className={styles.toolbar}>
                    <div className={styles.title_wrapper}>
                        <Link to="/">
                            <img
                                className={styles.logo}
                                src={logo}
                                alt="App logo"
                            />
                        </Link>
                        <Link className={styles.title} to="/">
                            <Typography
                                className={styles.title}
                                color="textPrimary"
                                variant="h6"
                                noWrap
                            >
                                Fulcrum Wiki
                            </Typography>
                        </Link>
                    </div>
                    <div className={styles.grow} />

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
