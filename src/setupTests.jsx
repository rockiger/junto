import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { vi } from 'vitest'

vi.mock('@react-oauth/google', () => ({
	GoogleOAuthProvider: ({ children }) => children,
	useGoogleLogin: () => vi.fn(),
}))

vi.mock('lib/googleAuth', async () => {
	const actual = await vi.importActual('lib/googleAuth/tokenStore')
	return {
		...actual,
		useGoogleAuth: () => ({
			signIn: vi.fn(),
			signOut: vi.fn(),
			isReady: true,
		}),
		AppGoogleAuthProvider: ({ children }) => children,
	}
})

// Mock gapi
global.window.gapi = {
	load: (_name, callback) => {
		if (callback) {
			callback()
		}
	},
	client: {
		init: () => Promise.resolve(),
		setToken: () => {},
	},
}

configure({ adapter: new Adapter() })
