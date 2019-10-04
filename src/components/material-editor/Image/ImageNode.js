import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'

import { insertImage } from './imagePlugin'
import { ToolbarButton } from '../Toolbar/Toolbar-container'
import { hasBlock } from '../Block'
import { getImage } from './gpicker'

export const ImageBlock = ({ node, isFocused }) => {
    const [loading, setLoading] = useState(true)
    const src = node.data.get('src')
    return (
        <>
            <Skeleton
                variant="rect"
                style={{
                    display: loading ? 'block' : 'none',
                    height: '10rem',
                    width: '20em',
                }}
            />
            <img
                src={src}
                alt=""
                style={{
                    display: loading ? 'none' : 'block',
                    maxHeight: '20em',
                    maxWidth: '100%',
                    boxShadow: isFocused ? '0 0 0 1px blue' : 'none',
                }}
                onLoad={() => setLoading(false)}
            />
        </>
    )
}

/**
 * When the imgae button is clicked, add an Image.
 *
 * @param {Event} event
 * @param {String} type
 */

const onClickImageButton = async (editor, event, apiKey) => {
    event.preventDefault()

    if (window.gapi && window.google) {
        // open Picker
        try {
            const src = await getImage(apiKey)
            editor.command(insertImage, src)
        } catch (err) {
            if (err.message === 'cancel') {
                console.log('Picker canceled')
            }
        }
    } else {
        const src = window.prompt('Enter the URL of the image:')
        if (!src) return
        editor.command(insertImage, src)
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

export const renderImageButton = (
    editor,
    value,
    icon,
    type,
    apiKey,
    shortcut = ''
) => {
    const isActive = hasBlock({ value }, 'image')

    return (
        <ToolbarButton
            active={isActive}
            onMouseDown={event => onClickImageButton(editor, event, apiKey)}
            shortcut={shortcut}
            style={{ color: isActive ? 'white' : 'black' }}
            value={type}
        >
            {icon}
        </ToolbarButton>
    )
}

ImageBlock.propTypes = {
    node: PropTypes.object.isRequired,
}
