import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import MenuIcon from 'mdi-react/MenuIcon'

import { ButtonMenu } from './ButtonMenu-container'

storiesOf('ButtonMenu', module)
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
                    buttonType="LinkButton"
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
                    position="left"
                >
                    Menu
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
    .add('with icon', () => {
        return (
            <>
                <ButtonMenu
                    items={[
                        {
                            icon: MenuIcon,
                            key: 1,
                            name: 'Menu Item 1',
                            handler: () => console.log('Menu Item 1'),
                        },
                        {
                            icon: MenuIcon,
                            key: 2,
                            name: 'Menu Item 2',
                            handler: () => console.log('Menu Item 2'),
                        },
                        {
                            icon: MenuIcon,
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
