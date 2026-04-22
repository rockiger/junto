import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import FrontPageHero from './front-page'

describe('FrontPageHero', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<FrontPageHero />, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})
