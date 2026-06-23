/** Google API client (loaded at runtime via script tag). */
export interface GapiAuthResponse {
	access_token: string
	expires_in: number
	expires_at?: number
}

export interface GapiAuthToken {
	access_token: string
	expires_at: number
}

export interface GapiBasicProfile {
	getId: () => string
	getEmail: () => string
}

export interface GapiGoogleUser {
	getAuthResponse: (includeAuthorizationData?: boolean) => GapiAuthResponse
	getBasicProfile: () => GapiBasicProfile
	reloadAuthResponse: () => Promise<GapiAuthResponse>
}

export interface GapiAuth2Instance {
	isSignedIn: {
		get: () => boolean
		listen: (listener: (signedIn: boolean) => void) => void
	}
	signIn: () => Promise<GapiGoogleUser>
	signOut: () => Promise<void>
	currentUser: {
		get: () => GapiGoogleUser
	}
}

export interface GapiClient {
	load: (module: string, callback?: () => void) => void
	client?: {
		init: (config: {
			apiKey?: string
			clientId?: string
			discoveryDocs?: string[]
			scope?: string
		}) => Promise<void>
		setToken: (token: { access_token: string } | null) => void
		drive: {
			files: {
				create: (params: Record<string, unknown>) => Promise<{ body: string }>
				list: (params: Record<string, unknown>) => Promise<{ body: string }>
			}
			permissions: {
				create: (params: Record<string, unknown>) => Promise<unknown>
			}
		}
	}
	auth?: {
		getToken: () => GapiAuthToken | null
	}
	auth2?: {
		getAuthInstance: () => GapiAuth2Instance
	}
	drive?: {
		share?: {
			ShareClient: new () => {
				setOAuthToken: (token: string) => void
				setItemIds: (ids: string[]) => void
			}
		}
	}
}

declare global {
	const gapi: GapiClient

	interface Window {
		gapi?: GapiClient
		google?: {
			picker?: Record<string, unknown>
		}
		share?: {
			showSettingsDialog: () => void
		}
	}

	interface HTMLScriptElement {
		/** Legacy IE property; still used for script load detection. */
		readyState?: string
	}
}

export {}
