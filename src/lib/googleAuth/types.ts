import type { OverridableTokenClientConfig } from '@react-oauth/google'

export interface StoredToken {
	access_token: string
	expires_at: number
}

export interface GoogleUserInfo {
	sub: string
	email: string
}

export type LoginTrigger = (
	overrideConfig?: OverridableTokenClientConfig,
) => void
