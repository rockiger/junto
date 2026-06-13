import type { LoginTrigger, StoredToken } from './types'

const TOKEN_STORAGE_KEY = 'junto-google-token'
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000

let currentToken: StoredToken | null = null
let loginTrigger: LoginTrigger | null = null
let refreshTimerId: ReturnType<typeof setTimeout> | null = null
const refreshWaiters: Array<{
	resolve: () => void
	reject: (error: Error) => void
}> = []

function getTokenStorage(): Storage {
	return localStorage
}

function migrateTokenFromSessionStorage() {
	try {
		if (getTokenStorage().getItem(TOKEN_STORAGE_KEY)) {
			return
		}

		const legacy = sessionStorage.getItem(TOKEN_STORAGE_KEY)
		if (legacy) {
			getTokenStorage().setItem(TOKEN_STORAGE_KEY, legacy)
			sessionStorage.removeItem(TOKEN_STORAGE_KEY)
		}
	} catch {
		// Storage may be unavailable in some environments.
	}
}

function clearProactiveRefresh() {
	if (refreshTimerId !== null) {
		clearTimeout(refreshTimerId)
		refreshTimerId = null
	}
}

function scheduleProactiveRefresh() {
	clearProactiveRefresh()

	if (!currentToken) {
		return
	}

	const delay = currentToken.expires_at - Date.now() - REFRESH_BEFORE_EXPIRY_MS
	if (delay <= 0) {
		void refreshToken().catch(() => {})
		return
	}

	refreshTimerId = setTimeout(() => {
		refreshTimerId = null
		void refreshToken().catch(() => {})
	}, delay)
}

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
	getTokenStorage().setItem(TOKEN_STORAGE_KEY, JSON.stringify(currentToken))
	scheduleProactiveRefresh()
}

export function clearAccessToken() {
	currentToken = null
	clearProactiveRefresh()
	getTokenStorage().removeItem(TOKEN_STORAGE_KEY)
}

export function loadStoredToken(): StoredToken | null {
	migrateTokenFromSessionStorage()

	if (currentToken && Date.now() < currentToken.expires_at) {
		scheduleProactiveRefresh()
		return currentToken
	}

	try {
		const raw = getTokenStorage().getItem(TOKEN_STORAGE_KEY)
		if (!raw) {
			return null
		}
		const parsed = JSON.parse(raw) as StoredToken
		if (parsed.access_token && Date.now() < parsed.expires_at) {
			currentToken = parsed
			scheduleProactiveRefresh()
			return parsed
		}
	} catch {
		getTokenStorage().removeItem(TOKEN_STORAGE_KEY)
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
		loginTrigger({ prompt: 'none' })
	})
}
