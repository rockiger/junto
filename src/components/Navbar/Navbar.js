import React, { useDispatch, useEffect, useGlobal } from 'reactn'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import logo from '../../static/logo_48.svg'

import Search from './Search'

import styles from './navbar.module.scss'

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
    return (
        <div className={styles.Navbar}>
            <Link className={styles.Navbar_logoContainer} to="/">
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
