import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { Button } from 'components/pageButtons'

/**
 * @typedef {object} Props
 * @prop {string} children
 * @prop {items} array
 *
 */
export function ButtonMenu({ children, items }) {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const onClose = () => setAnchorEl(null)

    /**
     *
     * @param {function} fn
     */
    const onSelect = (fn = () => {}) => {
        fn()
        onClose()
    }

    return (
        <span>
            {/* @ts-ignore */}
            <Button
                aria-controls="button-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                {children}
            </Button>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                getContentAnchorEl={null}
                id="button-menu"
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {items.map(el => (
                    <MenuItem key={el.key} onClick={() => onSelect(el.handler)}>
                        {el.name}
                    </MenuItem>
                ))}
            </Menu>
        </span>
    )
}

export default ButtonMenu
