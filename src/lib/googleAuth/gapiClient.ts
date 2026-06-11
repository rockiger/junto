import { API_KEY, DISCOVERY_DOCS } from 'lib/constants'

import { ensureGapi, getGapi } from '../gdrive/ensureGapi'

let gapiClientReady: Promise<void> | null = null

export function ensureGapiClient(): Promise<void> {
	if (gapiClientReady) {
		return gapiClientReady
	}

	gapiClientReady = ensureGapi().then(
		() =>
			new Promise((resolve, reject) => {
				getGapi().load('client', () => {
					const client = getGapi().client
					if (!client) {
						reject(new Error('gapi client is not available'))
						return
					}
					client
						.init({
							apiKey: API_KEY,
							discoveryDocs: DISCOVERY_DOCS,
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
