//@ts-check
import { useState } from 'react'

import { ButtonMenuComponent } from './ButtonMenu-component'

/**
 * @typedef {object} Props
 * @prop {'IconButton' | 'LinkButton'} [buttonType]
 * @prop {any} children
 * @prop {Array<*>} items
 * @prop {'center' | 'left' | 'right'} [position]
 * @prop {boolean} [selectable]
 * @prop {string} [tooltip]
 *
 */

/**
 * @param {Props} param0
 */
export function ButtonMenu({
    buttonType,
    children,
    items,
    position = 'center',
    selectable,
    tooltip,
}) {
    const [anchorEl, setAnchorEl] = useState(/** @type {HTMLElement | null} */ (null))

    /** @param {import('react').MouseEvent<HTMLElement>} event */
    const onClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const onClose = () => setAnchorEl(null)

    /**
     *
     * @param {function} fn
     */
    const onSelect = (fn = () => {}) => {
        onClose()
        fn()
    }

    return (
        <ButtonMenuComponent
            anchorEl={anchorEl}
            buttonType={buttonType}
            items={items}
            onClick={onClick}
            onClose={onClose}
            onSelect={onSelect}
            position={position}
            selectable={selectable}
            tooltip={tooltip}
        >
            {children}
        </ButtonMenuComponent>
    )
}

export default ButtonMenu
