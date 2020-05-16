import React, { useDispatch, useEffect, useGlobal } from 'reactn'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import IconButton from 'components/gsuite-components/icon-button'
import MenuIcon from 'mdi-react/MenuIcon'

import logo from '../../static/logo_48.svg'

import Search from './Search'

import styles from './navbar.module.scss'

const Navbar = (props) => {
    const [isSignedIn] = useGlobal('isSignedIn')
    const [, setIsSearchFieldActive] = useGlobal('isSearchFieldActive')
    const [searchTerm, setSearchTerm] = useGlobal('searchTerm')
    const [searchValue, setSearchValue] = useGlobal('searchValue')
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useGlobal(
        'showSidebarOnMobile'
    )

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
    return (
        <div className={styles.Navbar}>
            {isSignedIn && (
                <div className={styles.Navbar_menu}>
                    <IconButton
                        id=""
                        onClick={() => {
                            setShowSidebarOnMobile(!showSidebarOnMobile)
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            )}
            <Link
                className={classNames(
                    styles.Navbar_logoContainer,
                    isSignedIn && styles.Navbar_logoContainer__isSignedIn
                )}
                to="/"
            >
                <img className={styles.Navbar_logo} src={logo} alt="App logo" />
                <div className={styles.Navbar_title}>Fulcrum Wiki</div>
            </Link>
            <div className={styles.Navbar_spacer}>
                {props.isSignedIn && (
                    <Search clearSearch={clearSearch} submit={submit} />
                )}
            </div>
            <div className={styles.Navbar_actions}>{props.children}</div>
        </div>
    )
}

export default withRouter(Navbar)
Navbar.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
}
