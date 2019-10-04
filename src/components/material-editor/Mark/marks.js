import React from 'react'
import { hasMark } from './markPlugins'

import { ToolbarButton } from '../Toolbar/Toolbar-container'

export const BoldMark = props => {
    return <strong>{props.children}</strong>
}

export const CodeMark = props => {
    return <code className="code">{props.children}</code>
}

export const ItalicMark = props => {
    return <em>{props.children}</em>
}

export const StrikestroughMark = props => {
    return <strike>{props.children}</strike>
}

export const UnderlineMark = props => {
    return <u>{props.children}</u>
}

export function renderMark(props, editor, next) {
    switch (props.mark.type) {
        case 'bold':
            return <BoldMark>{props.children}</BoldMark>

        case 'code':
            return <CodeMark>{props.children}</CodeMark>

        case 'italic':
            return <ItalicMark>{props.children}</ItalicMark>

        case 'strikethrough':
            return <StrikestroughMark>{props.children}</StrikestroughMark>

        case 'underline':
            return <UnderlineMark>{props.children}</UnderlineMark>

        default:
            return next()
    }
}

/**
 * When a mark button is clicked, toggle the current mark.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickMarkButton = (editor, event, type) => {
    event.preventDefault()
    editor.toggleMark(type)
    editor.focus()
}

/**
 * Render a mark-toggling toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @return {Element}
 */

export const renderMarkButton = (editor, value, icon, type, shortcut = '') => {
    const isActive = hasMark({ value }, type)

    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickMarkButton(editor, event, type)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={type}
        >
            {icon}
        </ToolbarButton>
    )
}
