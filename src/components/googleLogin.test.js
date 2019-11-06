import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import GoogleLogin from './googleLogin'

describe('GoogleLogin', () => {
    const props = {
        setIsSigningIn: isSignedIn => {},
    }
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<GoogleLogin {...props} />, div)
        ReactDOM.unmountComponentAtNode(div)
    })

    it('has a signin button', () => {
        const element = shallow(<GoogleLogin {...props} isSignedIn={false} />)
        expect(element.find('#authorize_button').exists())
    })

    it('has a signout button', () => {
        const element = shallow(<GoogleLogin {...props} isSignedIn={true} />)
        expect(element.find('#signout_button').exists())
    })
})
