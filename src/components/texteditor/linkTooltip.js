import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Paper, Toolbar, Link } from '@material-ui/core'

import ContentCopyIcon from 'mdi-react/ContentCopyIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'
import LinkOffIcon from 'mdi-react/LinkOffIcon'
import EarthIcon from 'mdi-react/EarthIcon'

import Logo from '../logo'
import ToolbarButton from './toolbarButton'

const LinkTooltip = props => {
    const editor = props.editor
    const [href, setHref] = useState('https://test.de')
    const [isInternal, setIsInternal] = useState(false)
    const [left, setLeft] = useState(100)
    const [top, setTop] = useState(100)

    return (
        <Paper
            elevation={2}
            style={{
                alignItems: 'center',
                background: 'white',
                border: '1px solid lightgrey',
                cursor: 'default',
                display: props.show ? 'inline-flex' : 'none',
                left: left,
                minWidth: 275,
                padding: 5,
                position: 'fixed',
                top: top,
                zIndex: 1,
            }}
        >
            {isInternal ? (
                <Logo style={{ height: 18, width: 18 }} />
            ) : (
                <EarthIcon style={{ height: 18, width: 18 }} />
            )}
            <a
                href={href}
                alt={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => window.open(href, '_blank')}
                style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '.9rem',
                    fontWeight: 500,
                    letterSpacing: 0.3,
                    margin: '.1rem 8px 0',
                    width: 180,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {href}
            </a>
            <ToolbarButton
                onMouseDown={ev => {
                    copyToClipboard(href)
                    //props.closeTooltip();
                    // props.setEditorState({ autocompleteValue: '', showTooltip: false }, ()=> editor.focus() )
                    editor.focus()
                }}
                style={{ height: 30, width: 30 }}
            >
                <ContentCopyIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>

            <ToolbarButton
                onMouseDown={ev => {
                    props.setAutocompleteValue(href)
                    // props.setShowTooltip(false)
                    props.setModal(true)
                    editor.focus()
                }}
                style={{ height: 30, width: 30 }}
            >
                <PencilOutlineIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>
            <ToolbarButton
                onMouseDown={ev => {
                    //editor.unwrapInline('link').focus()
                    props.setEditorState({ showTooltip: false })
                }}
                style={{ height: 30, width: 30 }}
            >
                <LinkOffIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>
        </Paper>
    )
}
LinkTooltip.propTypes = {
    editor: PropTypes.object.isRequired,
    show: PropTypes.bool,
}
Link.defaultProps = {
    show: false,
}

export default LinkTooltip

function copyToClipboard(str) {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
    }
}

function getSelectionElement() {
    var selection = window.getSelection()
    var container = selection.anchorNode
    if (container.nodeType !== 3) {
        return container
    } else {
        // return parent if text node
        return container.parentElement
    }
}

/**
 * Get the href of the current selection if any
 *
 * @param {value} slateeditor value
 *
 * @return {String} href
 */

function getHref(value) {
    const link = value.inlines.filter(inline => inline.type === 'link').first()
    try {
        return link.data.get('href')
    } catch (error) {
        return ''
    }
}
