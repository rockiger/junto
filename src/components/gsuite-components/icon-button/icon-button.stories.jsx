import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import IconButton from './icon-button'

import CogOutlineIcon from 'mdi-react/CogOutlineIcon'

storiesOf('IconButton', module)
    .addDecorator(story => (
        <div
            style={{
                display: 'flex',
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
                alignItems: 'center',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => {
        return (
            <>
                <IconButton>
                    <CogOutlineIcon />
                </IconButton>
            </>
        )
    })
    .add('tooltip', () => {
        return (
            <>
                <IconButton tooltip="Tooltip">
                    <CogOutlineIcon />
                </IconButton>
                <span>Hover over icon</span>
            </>
        )
    })
