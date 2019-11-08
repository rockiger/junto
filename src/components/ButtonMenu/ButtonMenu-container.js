import React, { useState } from 'react'

import { Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core'
import CheckIcon from 'mdi-react/CheckIcon'

import { Button } from 'components/pageButtons'
import { THEME } from 'lib/constants'

import { useStyles } from './Buttno-menu-styles'

console.log(THEME)
/**
 * @typedef {object} Props
 * @prop {string} children
 * @prop {items} array
 *
 */
export function ButtonMenu({ children, items }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const styles = useStyles()

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
                className={anchorEl ? styles.active : null}
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
                        {el.active && (
                            <ListItemIcon style={{ minWidth: '2.25rem' }}>
                                <CheckIcon />
                            </ListItemIcon>
                        )}
                        <ListItemText
                            style={{
                                paddingLeft: !el.active ? '2.25rem' : null,
                            }}
                        >
                            {el.name}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </span>
    )
}

export default ButtonMenu
