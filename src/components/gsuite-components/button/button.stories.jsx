import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button from './button'

storiesOf('Button', module)
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
                <Button>Sign up</Button>
            </>
        )
    })
    .add('primary', () => {
        return (
            <>
                <Button primary>Sign up</Button>
            </>
        )
    })
