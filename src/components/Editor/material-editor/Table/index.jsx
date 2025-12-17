import React from 'react'

import { ToolbarButton } from '../Toolbar/Toolbar-container'

/**
 * When a link button is clicked, toggle the link.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickTableButton = async (editor, event, methodName) => {
    event.preventDefault()
    editor[methodName]()
}

/**
 * Render a table-toggling toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @return {Element}
 */

export const renderTableButton = (editor, icon, methodName, shortcut = '') => {
    const isActive = false
    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickTableButton(editor, event, methodName)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={methodName}
        >
            {icon}
        </ToolbarButton>
    )
}
