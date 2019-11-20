import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MaterialLink } from '@material-ui/core'

import { hasLinks, toggleLink } from './linkPlugin'
import LinkTooltip from './LinkTooltip'
import { ToolbarButton } from '../Toolbar/Toolbar-container'

export function LinkNode({
    showTooltip,
    attributes,
    href,
    children,
    onClickEdit,
    onClickRemove,
    readOnly,
}) {
    return (
        <span
            style={{
                position: 'relative',
            }}
        >
            {showTooltip && (
                <LinkTooltip
                    href={href}
                    onClickEdit={onClickEdit}
                    onClickRemove={onClickRemove}
                    show={true}
                />
            )}
            {href && href.startsWith('/page/') ? (
                <RouterLink
                    className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
                    to={href}
                    onClick={ev => {
                        if (!readOnly) ev.preventDefault()
                    }}
                >
                    {children}
                </RouterLink>
            ) : (
                <MaterialLink
                    {...attributes}
                    href={href}
                    target={
                        href && href.startsWith('/page/') ? '_self' : '_blank'
                    }
                >
                    {children}
                </MaterialLink>
            )}
        </span>
    )
}
LinkNode.propTypes = {
    href: PropTypes.string.isRequired,
    showTooltip: PropTypes.bool,
    children: PropTypes.node,
}

/**
 * When a link button is clicked, toggle the link.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickLinkButton = async (editor, event, type) => {
    event.preventDefault()
    toggleLink(editor, event, type)
}

/**
 * Render a image toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @return {Element}
 */

export const renderLinkButton = (editor, value, icon, type, shortcut = '') => {
    const isActive = hasLinks({ value })

    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickLinkButton(editor, event, type)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={type}
        >
            {icon}
        </ToolbarButton>
    )
}
