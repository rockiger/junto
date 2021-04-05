import React from 'react'

import { Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core'
import CheckIcon from 'mdi-react/CheckIcon'

import { Button as IconButton } from 'components/pageButtons'
import { LinkButton } from "components/gsuite-components/link-button";
import { useStyles } from './Buttno-menu-styles'
import MenuDownIcon from "mdi-react/MenuDownIcon";

const BUTTONTYPES = {IconButton, LinkButton}

/**
 * @typedef {object} Props
 * @prop {string} children
 * @prop {items} array
 *
 */
export function ButtonMenuComponent({
    anchorEl,
    buttonType = 'IconButton',
    children,
    items,
    onClick,
    onClose,
    onSelect,
    position,
    selectable,
    tooltip
}) {
    const classes = useStyles()
    const ButtonComponent = BUTTONTYPES[buttonType]
    return (
        <span>
            <ButtonComponent
                aria-controls="button-menu"
                aria-haspopup="true"
                className={Boolean(anchorEl) ? classes.active : null}
                Icon={MenuDownIcon}
                onClick={onClick}
                tooltip={tooltip}
            >
                {children}
            </ButtonComponent>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: position,
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
