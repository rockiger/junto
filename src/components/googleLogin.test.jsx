import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import { vi } from 'vitest'

import GoogleLogin from './googleLogin'

let mockIsSignedIn = false

vi.mock('reactn', () => ({
	useGlobal: (key) => {
		if (key === 'isSignedIn') {
			return [mockIsSignedIn]
		}
		return [undefined]
	},
}))

vi.mock('lib/googleAuth', () => ({
	useGoogleAuth: () => ({
		signIn: vi.fn(),
		signOut: vi.fn(),
		isReady: true,
	}),
}))

describe('GoogleLogin', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<GoogleLogin buttonText="Sign in" />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a signin button', () => {
		mockIsSignedIn = false
		const element = shallow(<GoogleLogin buttonText="Sign in" />)
		expect(element.find('#authorize_button').exists()).toBe(true)
	})

	it('has a signout button when signed in', () => {
		mockIsSignedIn = true
		const element = shallow(<GoogleLogin buttonText="Sign in" />)
		expect(element.find('#LogoutButton').exists()).toBe(true)
		mockIsSignedIn = false
	})
})
