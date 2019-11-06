import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import Nav from './Navbar'

describe('Nav', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
    it('has no searchbar if not signed in', () => {
        const element = shallow(
            <MemoryRouter>
                <Nav isSignedIn={false} />
            </MemoryRouter>
        )
        expect(element.find('.Nav-search-form').length).toBe(0)
    })

    it('has a searchbar if signed in', () => {
        const element = shallow(
            <MemoryRouter>
                <Nav isSignedIn={true} />
            </MemoryRouter>
        )
        expect(element.html().includes('aria-label="Search"')).toBe(true)
    })
})
