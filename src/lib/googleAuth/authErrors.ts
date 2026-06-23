function messageFromBody(body: string): string | undefined {
	try {
		const parsed = JSON.parse(body) as { error?: { message?: string } }
		return parsed.error?.message
	} catch {
		return undefined
	}
}

/**
 * Detects Google API "Invalid Credentials" errors across gapi response shapes.
 */
export function isInvalidCredentialsError(err: unknown): boolean {
	if (!err || typeof err !== 'object') {
		return false
	}

	const apiErr = err as {
		status?: number
		result?: { error?: { message?: string } }
		body?: string
		message?: string
	}

	if (apiErr.status === 401) {
		if (apiErr.result?.error?.message === 'Invalid Credentials') {
			return true
		}
	}

	if (typeof apiErr.body === 'string') {
		if (messageFromBody(apiErr.body) === 'Invalid Credentials') {
			return true
		}
	}

	if (apiErr.message === 'Invalid Credentials') {
		return true
	}

	return false
}
