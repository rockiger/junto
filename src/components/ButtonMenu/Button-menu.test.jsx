import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import { render, queryByAttribute } from '@testing-library/react'
// NOTE: React Testing Library works with React Hooks _and_ classes just as well
// and your tests will be the same however you write your components.
import '@testing-library/jest-dom/extend-expect'

import MenuIcon from 'mdi-react/MenuIcon'

import { ButtonMenu } from './ButtonMenu-container'

const getById = queryByAttribute.bind(null, 'id')
const getByAriaHidden = queryByAttribute.bind(null, 'aria-hidden')

it('Menu opens and closes', () => {
    const dom = render(
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
    )
    const { container, getByText, debug } = dom
    const menuButton = container.querySelector('button')
    const menuItem = getByText(/Menu Item 1/i)

    expect(menuItem).not.toBeVisible()

    menuButton.click()
    expect(menuItem).toBeVisible()

    menuItem.click()
    expect(menuItem).not.toBeVisible()

    menuButton.click()
    expect(menuItem).toBeVisible()
})

it('Menu has checkmark', () => {
    const dom = render(
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
    )
    const { container, getByRole, debug } = dom
    const menuButton = container.querySelector('button')
    menuButton.click()
    const menu = getByRole('menu') //getById(container, 'ButtenMenu-Checkmark')

    const checkmark = menu.querySelector('svg')
    expect(checkmark).toBeVisible()
})
