import { getGapi } from '../gdrive/ensureGapi'

import { getGapiAuthInstance } from './gapiClient'

function applyAuthResponseToClient(accessToken: string) {
	const client = getGapi().client
	if (client) {
		client.setToken({ access_token: accessToken })
	}
}

function cleanupLegacyGisTokenStorage() {
	try {
		localStorage.removeItem('junto-google-token')
		localStorage.removeItem('junto-was-authenticated')
		sessionStorage.removeItem('junto-google-token')
	} catch {
		// Storage may be unavailable in some environments.
	}
}

cleanupLegacyGisTokenStorage()

export function getAccessToken(): string | null {
	try {
		const authInstance = getGapiAuthInstance()
		if (!authInstance.isSignedIn.get()) {
			return null
		}

		const token = getGapi().auth?.getToken()
		if (
			token?.access_token &&
			typeof token.expires_at === 'number' &&
			Date.now() < token.expires_at
		) {
			return token.access_token
		}

		const authResponse = authInstance.currentUser.get().getAuthResponse(true)
		return authResponse?.access_token ?? null
	} catch {
		return null
	}
}

export function isTokenValid(): boolean {
	return getAccessToken() !== null
}

export function forceRefreshAuth(): Promise<void> {
	const authInstance = getGapiAuthInstance()
	if (!authInstance.isSignedIn.get()) {
		return Promise.reject(new Error('User is not signed in'))
	}

	return authInstance.currentUser
		.get()
		.reloadAuthResponse()
		.then((authResponse) => {
			applyAuthResponseToClient(authResponse.access_token)
		})
}

export function refreshToken(): Promise<void> {
	if (isTokenValid()) {
		return Promise.resolve()
	}

	return forceRefreshAuth()
}
