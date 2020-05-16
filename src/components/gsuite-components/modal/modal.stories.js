import React from 'react'
import { storiesOf } from '@storybook/react'

import Modal from './modal'

storiesOf('Modal', module)
    .addDecorator((story) => (
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
                <Modal></Modal>
            </>
        )
    })
