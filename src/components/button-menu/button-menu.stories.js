import React from 'react'
import { storiesOf } from '@storybook/react'

import MenuIcon from 'mdi-react/MenuIcon'

import ButtonMenu from './button-menu'

storiesOf('ButtonMenu1', module)
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
                    items={[
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
    .add('selectable', () => {
        return (
            <>
                <ButtonMenu
                    items={[
                        {
                            key: 1,
                            name: 'Menu Item 1',
                            handler: () => console.log('Menu Item 1'),
                        },
                        {
                            key: 2,
                            name: 'Menu Item 2',
                            handler: () => console.log('Menu Item 2'),
                            active: true,
                        },
                        {
                            key: 3,
                            name: 'Menu Item 3',
                            handler: () => console.log('Menu Item 3'),
                        },
                    ]}
                    selectable={true}
                >
                    <MenuIcon />
                </ButtonMenu>
            </>
        )
    })
