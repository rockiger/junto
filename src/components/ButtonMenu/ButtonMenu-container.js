// @ts-check
import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { Button } from 'components/pageButtons'

/**
 * @typedef {object} Props
 * @prop {string} children
 * @prop {files} array
 *
 */
export function ButtonMenu({ children, files }) {
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
        <div>
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
                {files.map(el => (
                    <MenuItem key={el.key} onClick={() => onSelect(el.handler)}>
                        {el.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ButtonMenu
