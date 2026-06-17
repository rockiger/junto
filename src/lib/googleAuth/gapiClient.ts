import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from 'lib/constants'

import { ensureGapi, getGapi } from '../gdrive/ensureGapi'

let gapiClientReady: Promise<void> | null = null

export function getGapiAuthInstance() {
	const auth2 = getGapi().auth2
	if (!auth2) {
		throw new Error('gapi auth2 is not loaded. Call ensureGapiClient() first.')
	}
	return auth2.getAuthInstance()
}

export function ensureGapiClient(): Promise<void> {
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
