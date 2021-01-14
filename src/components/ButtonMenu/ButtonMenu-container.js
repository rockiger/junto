//@ts-check
import React, { useState } from 'react'

import { ButtonMenuComponent } from './ButtonMenu-component'

/**
 * @typedef {object} Props
 * @prop {any} children
 * @prop {array} items
 * @prop {boolean} [selectable]
 *
 */

/**
 * @param {Props} param0
 */
export function ButtonMenu({ children, items, selectable }) {
    const [anchorEl, setAnchorEl] = useState(null)

    const onClick = event => {
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
        <ButtonMenuComponent
            anchorEl={anchorEl}
            items={items}
            onClick={onClick}
            onClose={onClose}
            onSelect={onSelect}
            selectable={selectable}
        >
            {children}
        </ButtonMenuComponent>
    )
}

export default ButtonMenu
