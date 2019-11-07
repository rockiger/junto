import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import MenuIcon from 'mdi-react/MenuIcon'

import { ButtonMenu } from './ButtonMenu-container'

storiesOf('ButtonMenu', module)
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
                <ButtonMenu
                    files={[
                        {
                            key: 1,
                            name: 'Menu Item 1',
                            handler: () => console.log('Menu Item 1'),
                        },
                        {
                            key: 2,
                            name: 'Menu Item 2',
                            handler: () => console.log('Menu Item 2'),
                        },
                        {
                            key: 3,
                            name: 'Menu Item 3',
                            handler: () => console.log('Menu Item 3'),
                        },
                    ]}
                >
                    <MenuIcon />
                </ButtonMenu>
            </>
        )
    })
