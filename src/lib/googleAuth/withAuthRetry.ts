import { isInvalidCredentialsError } from './authErrors'
import { forceRefreshAuth } from './tokenStore'

/**
 * Runs a Drive API call and retries once after forcing a token refresh on
 * "Invalid Credentials" errors.
 */
export async function withAuthRetry<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn()
	} catch (err) {
		if (!isInvalidCredentialsError(err)) {
			throw err
		}
		await forceRefreshAuth()
		return await fn()
	}
}
