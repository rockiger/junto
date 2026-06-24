import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from 'lib/constants'

import { ensureGapi, getGapi } from '../gdrive/ensureGapi'

let gapiClientReady: Promise<void> | null = null

function assertGoogleEnvConfig(): void {
	if (!CLIENT_ID?.trim()) {
		throw new Error(
			'VITE_GOOGLE_CLIENT_ID is not set. Copy .env.example to .env.local, add your Google OAuth client ID, and restart the dev server.',
		)
	}
	if (!API_KEY?.trim()) {
		throw new Error(
			'VITE_API_KEY is not set. Copy .env.example to .env.local, add your Google API key, and restart the dev server.',
		)
	}
}

export function getGapiAuthInstance() {
	const auth2 = getGapi().auth2
	if (!auth2) {
		throw new Error('gapi auth2 is not loaded. Call ensureGapiClient() first.')
	}
	const authInstance = auth2.getAuthInstance()
	if (!authInstance) {
		throw new Error(
			'gapi auth2 instance is not initialized. Call ensureGapiClient() first.',
		)
	}
	return authInstance
}

async function ensureAuthInstance(): Promise<void> {
	const auth2 = getGapi().auth2
	if (!auth2) {
		throw new Error('gapi auth2 is not available')
	}
	if (auth2.getAuthInstance()) {
		return
	}
	await auth2.init({
		client_id: CLIENT_ID,
		scope: SCOPES,
	})
	if (!auth2.getAuthInstance()) {
		throw new Error('gapi auth2 failed to initialize')
	}
}

export function ensureGapiClient(): Promise<void> {
	assertGoogleEnvConfig()

	if (gapiClientReady) {
		return gapiClientReady
	}

	gapiClientReady = ensureGapi().then(
		() =>
			new Promise((resolve, reject) => {
				getGapi().load('client:auth2', () => {
					const client = getGapi().client
					if (!client) {
						reject(new Error('gapi client is not available'))
						return
					}
					client
						.init({
							apiKey: API_KEY,
							clientId: CLIENT_ID,
							discoveryDocs: DISCOVERY_DOCS,
							scope: SCOPES,
						})
						.then(() => ensureAuthInstance())
						.then(() => resolve(), reject)
				})
			}),
	)

	return gapiClientReady.catch((error) => {
		gapiClientReady = null
		throw error
	})
}

export function applyTokenToGapiClient(accessToken: string | null) {
	const gapi = getGapi()
	if (!gapi.client) {
		return
	}
	gapi.client.setToken(
		accessToken ? { access_token: accessToken } : null,
	)
}
