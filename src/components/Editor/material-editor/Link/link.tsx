// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from '@tanstack/react-router'
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
            {showTooltip && !readOnly && (
                <LinkTooltip
                    href={href}
                    onClickEdit={onClickEdit}
                    onClickRemove={onClickRemove}
                    show={true}
                />
            )}
            {href && href.startsWith('/page/') ? (
                (() => {
                    const m = href.match(/^\/page\/([^/?#]+)/)
                    return m ? (
                        <Link
                            {...attributes}
                            className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
                            to="/page/$id"
                            params={{
                                id: m[1],
                            }}
                            onClick={ev => {
                                if (!readOnly) ev.preventDefault()
                            }}
                        >
                            {children}
                        </Link>
                    ) : (
                        <MaterialLink
                            {...attributes}
                            href={href}
                            target={
                                href && href.startsWith('/page/')
                                    ? '_self'
                                    : '_blank'
                            }
                        >
                            {children}
                        </MaterialLink>
                    )
                })()
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
