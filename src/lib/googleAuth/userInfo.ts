import type { GoogleUserInfo } from './types'
import { getAccessToken } from './tokenStore'

let cachedUserInfo: GoogleUserInfo | null = null

export function getCachedUserInfo(): GoogleUserInfo | null {
	return cachedUserInfo
}

export function getUserEmail(): string {
	const email = cachedUserInfo?.email
	if (!email) {
		throw new Error('No user email found')
	}
	return email
}

export function getUserId(): string {
	const userId = cachedUserInfo?.sub
	if (!userId) {
		throw new Error('No user id found')
	}
	return userId
}

export function clearCachedUserInfo() {
	cachedUserInfo = null
}

export async function fetchUserInfo(
	accessToken: string,
): Promise<GoogleUserInfo> {
	const response = await fetch(
		'https://www.googleapis.com/oauth2/v3/userinfo',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

	if (!response.ok) {
		throw new Error('Failed to fetch Google user info')
	}

	const data = (await response.json()) as GoogleUserInfo
	cachedUserInfo = data
	return data
}

export async function ensureUserInfo(): Promise<GoogleUserInfo | null> {
	if (cachedUserInfo) {
		return cachedUserInfo
	}

	const accessToken = getAccessToken()
	if (!accessToken) {
		return null
	}

	return fetchUserInfo(accessToken)
}
