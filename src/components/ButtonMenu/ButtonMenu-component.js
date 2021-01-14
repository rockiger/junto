import React from 'react'

import { Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core'
import CheckIcon from 'mdi-react/CheckIcon'

import { Button } from 'components/pageButtons'

import { useStyles } from './Buttno-menu-styles'
/**
 * @typedef {object} Props
 * @prop {string} children
 * @prop {items} array
 *
 */
export function ButtonMenuComponent({
    anchorEl,
    children,
    items,
    onClick,
    onClose,
    onSelect,
    selectable,
}) {
    const classes = useStyles()

    return (
        <span>
            <Button
                aria-controls="button-menu"
                aria-haspopup="true"
                className={Boolean(anchorEl) ? classes.active : null}
                onClick={onClick}
                tooltip="Sort options"
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
                style={{ zIndex: 1000 }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {items.map(el => (
                    <MenuItem key={el.key} onClick={() => onSelect(el.handler)}>
                        {selectable && el.active && (
                            <ListItemIcon style={{ minWidth: '2.25rem' }}>
                                <CheckIcon id="ButtenMenu-Checkmark" />
                            </ListItemIcon>
                        )}
                        <ListItemText
                            style={{
                                paddingLeft:
                                    selectable && !el.active ? '2.25rem' : null,
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

export default ButtonMenuComponent
