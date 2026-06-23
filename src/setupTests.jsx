import { vi } from 'vitest'

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

const auth2Instance = {
	isSignedIn: {
		get: () => false,
		listen: () => {},
	},
	signIn: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
	currentUser: {
		get: () => ({
			getAuthResponse: () => ({ access_token: '' }),
			reloadAuthResponse: () =>
				Promise.resolve({ access_token: '' }),
		}),
	},
}

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
	auth2: {
		getAuthInstance: () => auth2Instance,
	},
	auth: {
		getToken: () => null,
	},
}
