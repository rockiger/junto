import type { LoginTrigger, StoredToken } from './types'

const TOKEN_STORAGE_KEY = 'junto-google-token'

let currentToken: StoredToken | null = null
let loginTrigger: LoginTrigger | null = null
const refreshWaiters: Array<{
	resolve: () => void
	reject: (error: Error) => void
}> = []

export function registerLoginTrigger(trigger: LoginTrigger) {
	loginTrigger = trigger
}

export function getAccessToken(): string | null {
	if (currentToken && Date.now() < currentToken.expires_at) {
		return currentToken.access_token
	}
	return null
}

export function isTokenValid(): boolean {
	return getAccessToken() !== null
}

export function setAccessToken(accessToken: string, expiresInSeconds = 3600) {
	currentToken = {
		access_token: accessToken,
		expires_at: Date.now() + expiresInSeconds * 1000 - 60_000,
	}
	sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(currentToken))
}

export function clearAccessToken() {
	currentToken = null
	sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function loadStoredToken(): StoredToken | null {
	if (currentToken && Date.now() < currentToken.expires_at) {
		return currentToken
	}

	try {
		const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY)
		if (!raw) {
			return null
		}
		const parsed = JSON.parse(raw) as StoredToken
		if (parsed.access_token && Date.now() < parsed.expires_at) {
			currentToken = parsed
			return parsed
		}
	} catch {
		sessionStorage.removeItem(TOKEN_STORAGE_KEY)
	}

	return null
}

export function resolveRefreshWaiters() {
	for (const waiter of refreshWaiters) {
		waiter.resolve()
	}
	refreshWaiters.length = 0
}

export function rejectRefreshWaiters(error: Error) {
	for (const waiter of refreshWaiters) {
		waiter.reject(error)
	}
	refreshWaiters.length = 0
}

export function refreshToken(): Promise<void> {
	if (isTokenValid()) {
		return Promise.resolve()
	}

	return new Promise((resolve, reject) => {
		if (!loginTrigger) {
			reject(new Error('Google auth is not initialized'))
			return
		}

		refreshWaiters.push({ resolve, reject })
		loginTrigger({ prompt: '' })
	})
}
