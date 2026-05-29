const GAPI_SCRIPT_URL = 'https://apis.google.com/js/api.js'

let loadPromise: Promise<NonNullable<Window['gapi']>> | null = null

export function getGapi(): NonNullable<Window['gapi']> {
	if (!window.gapi) {
		throw new Error('gapi is not loaded. Call ensureGapi() first.')
	}
	return window.gapi
}

function waitForExistingScript(): Promise<NonNullable<Window['gapi']>> {
	return new Promise((resolve, reject) => {
		const existing = document.querySelector(
			`script[src="${GAPI_SCRIPT_URL}"]`,
		) as HTMLScriptElement | null

		if (!existing) {
			reject(new Error('gapi script element not found'))
			return
		}

		if (window.gapi) {
			resolve(window.gapi)
			return
		}

		const onLoad = () => {
			if (window.gapi) {
				resolve(window.gapi)
			} else {
				reject(
					new Error('gapi script loaded but window.gapi is missing'),
				)
			}
		}

		if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
			onLoad()
			return
		}

		existing.addEventListener('load', onLoad, { once: true })
		existing.addEventListener(
			'error',
			() => reject(new Error('Failed to load Google API script')),
			{ once: true },
		)
	})
}

function injectGapiScript(): Promise<NonNullable<Window['gapi']>> {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = GAPI_SCRIPT_URL
		script.async = true
		script.defer = true
		script.onload = () => {
			if (window.gapi) {
				resolve(window.gapi)
			} else {
				reject(
					new Error('gapi script loaded but window.gapi is missing'),
				)
			}
		}
		script.onerror = () =>
			reject(new Error('Failed to load Google API script'))
		document.head.appendChild(script)
	})
}

/**
 * Ensures the Google API loader (`window.gapi`) is available.
 * Reuses the script from index.html when present, or injects it dynamically.
 */
export function ensureGapi(): Promise<NonNullable<Window['gapi']>> {
	if (window.gapi) {
		return Promise.resolve(window.gapi)
	}

	if (!loadPromise) {
		const hasScript = document.querySelector(
			`script[src="${GAPI_SCRIPT_URL}"]`,
		)
		loadPromise = (hasScript ? waitForExistingScript() : injectGapiScript())
			.catch((err) => {
				loadPromise = null
				throw err
			})
	}

	return loadPromise
}
