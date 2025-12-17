import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import Home from './home'

describe('Home', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <MemoryRouter>
                <Home isSignedIn={true} isSigningIn={true} />
            </MemoryRouter>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
