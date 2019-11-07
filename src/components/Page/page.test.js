import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import { MemoryRouter } from 'react-router-dom'

import Page from './page'

describe('Page', () => {
    const props = {
        isSignedIn: false,
        isSigningIn: false,
        match: {
            params: { id: '' },
        },
        setGoToNewFile: () => {},
    }

    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <MemoryRouter>
                <Page {...props} />
            </MemoryRouter>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
