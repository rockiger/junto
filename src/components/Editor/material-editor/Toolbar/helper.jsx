import React from 'react'
import ToolbarButton from './Toolbar-container'

/**
 * Render a toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @param {Function} onClickButton
 * @param {bool} isActive
 * @param {String} shortcut
 * @return {Element}
 */

export const renderToolbarButton = (
    editor,
    icon,
    type,
    onClick,
    isActive,
    shortcut = ''
) => {
    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClick(editor, event, type)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={type}
        >
            {icon}
        </ToolbarButton>
    )
}
