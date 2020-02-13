import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import IconButton from './icon-button'

import CogOutlineIcon from 'mdi-react/CogOutlineIcon'

storiesOf('IconButton', module)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <div
            style={{
                display: 'flex',
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
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
