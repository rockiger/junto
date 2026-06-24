import { render } from '@testing-library/react'
import { vi } from 'vitest'

import GoogleLogin from './googleLogin'

let mockIsSignedIn = false

vi.mock('store/app-store', () => ({
	useAppStore: (selector) =>
		selector({ isSignedIn: mockIsSignedIn }),
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
		render(<GoogleLogin buttonText="Sign in" />)
	})

	it('has a signin button', () => {
		mockIsSignedIn = false
		render(<GoogleLogin buttonText="Sign in" />)
		expect(document.getElementById('authorize_button')).toBeTruthy()
	})

	it('has a signout button when signed in', () => {
		mockIsSignedIn = true
		render(<GoogleLogin buttonText="Sign in" />)
		expect(document.getElementById('LogoutButton')).toBeTruthy()
		mockIsSignedIn = false
	})
})
