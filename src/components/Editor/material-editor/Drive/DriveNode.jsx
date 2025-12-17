import React from 'react'
//import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box'

import DomainIcon from 'mdi-react/DomainIcon'
import CloseIcon from 'mdi-react/CloseIcon'

import { ToolbarButton } from '../Toolbar/Toolbar-container'
import { getDocument } from './gpicker'

// FIXME: Needs to handle assets files to work with SSR
//if (require('exenv').canUseDOM) require('./LinkNode.css')

export function DriveNode({ editor, attributes, node }) {
    const id = node.data.get('id')
    const name = node.data.get('name')
    const href = node.data.get('href')
    const iconUrl = node.data.get('iconUrl')
    const internal = name.endsWith('.gwiki')
    const internalName = internal
        ? name.substr(0, name.length - '.gwiki'.length)
        : name
    const readOnly = editor.props.readOnly

    return (
        <Box
            contentEditable={false}
            borderRadius={3}
            boxShadow={1}
            className="drive-link-node-container"
            component="span"
            style={{ padding: '0 .25rem 2px' }}
            onKeyDown={ev => console.log(ev.key)}
        >
            {internal ? (
                <a
                    href={`/page/${id}`}
                    to={`/page/${id}`}
                    {...attributes}
                    className="link-node"
                    title={internalName}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DomainIcon
                        style={{
                            height: 16,
                            marginBottom: -3,
                            marginRight: '.25rem',
                            width: 16,
                        }}
                    />
                    {internalName}
                </a>
            ) : (
                <a
                    {...attributes}
                    className="link-node"
                    href={href}
                    target={'_blank'}
                    title={name}
                    rel="noopener noreferrer"
                >
                    <img
                        alt=""
                        src={iconUrl}
                        style={{
                            marginBottom: -3,
                            marginRight: '.25rem',
                        }}
                    />
                    {name}
                </a>
            )}
            {/* Function is to sketchy right now. User can remove by hand */
            !readOnly && (
                <CloseIcon
                    contentEditable={false}
                    onClick={() => editor.removeNodeByKey(node.key)}
                    size={12}
                    style={{
                        marginBottom: -1,
                        marginLeft: 2,
                        marginRight: 2,
                        cursor: 'pointer',
                    }}
                />
            )}
        </Box>
    )
}

export default DriveNode

/**
 * When the imgae button is clicked, add an Image.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickDriveButton = async (editor, event, apiKey) => {
    event.preventDefault()

    if (window.gapi && window.google) {
        // open Picker
        try {
            const { id, name, href, iconUrl } = await getDocument(apiKey)
            editor
                .insertText(' ')
                .insertText(name)
                .moveFocusBackward(name.length)
                .wrapInline({
                    type: 'drive-link',
                    data: { id, name, href, iconUrl },
                })
                .moveToEnd()
                .insertText(' ')
        } catch (err) {
            if (err.message === 'cancel') {
                console.log('Picker canceled')
            }
        }
    } else {
        alert("Couldn't open picker.")
    }
}

/**
 * Render a link-toggling toolbar button.
 *
 * @param {Slatejs} editor
 * @param {String} icon
 * @param {String} type
 * @return {Element}
 */

export const renderDriveButton = (editor, icon, type, shortcut = '') => {
    const isActive = false

    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickDriveButton(editor, event, type)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={'image'}
        >
            {icon}
        </ToolbarButton>
    )
}
