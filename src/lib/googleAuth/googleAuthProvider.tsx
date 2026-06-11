import type { OverridableTokenClientConfig } from '@react-oauth/google'
import { useGoogleLogin } from '@react-oauth/google'
import { SCOPES } from 'lib/constants'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	type ReactNode,
} from 'react'
import { setGlobal } from 'reactn'

import { applyTokenToGapiClient, ensureGapiClient } from './gapiClient'
import {
	resetPostSignInInit,
	runPostSignInInit,
} from './postSignInInit'
import {
	clearAccessToken,
	loadStoredToken,
	registerLoginTrigger,
	rejectRefreshWaiters,
	resolveRefreshWaiters,
	setAccessToken,
} from './tokenStore'
import {
	clearCachedUserInfo,
	fetchUserInfo,
} from './userInfo'

type GoogleAuthContextValue = {
	signIn: () => void
	signOut: () => void
	isReady: boolean
}

const GoogleAuthContext = createContext<GoogleAuthContextValue | null>(null)

function revokeAccessToken(accessToken: string) {
	if (window.google?.accounts?.oauth2?.revoke) {
		window.google.accounts.oauth2.revoke(accessToken, () => { })
	}
}

export function useGoogleAuth(): GoogleAuthContextValue {
	const context = useContext(GoogleAuthContext)
	if (!context) {
		throw new Error('useGoogleAuth must be used within GoogleAuthProvider')
	}
	return context
}

type GoogleAuthProviderProps = {
	children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
	const loginRef = useRef<
		((overrideConfig?: OverridableTokenClientConfig) => void) | null
	>(null)

	const handleTokenSuccess = useCallback(
		async (tokenResponse: { access_token: string; expires_in?: number }) => {
			setAccessToken(
				tokenResponse.access_token,
				tokenResponse.expires_in ?? 3600,
			)
			await ensureGapiClient()
			applyTokenToGapiClient(tokenResponse.access_token)

			try {
				const userInfo = await fetchUserInfo(tokenResponse.access_token)
				setGlobal({
					isSignedIn: true,
					isSigningIn: false,
					userId: userInfo.sub,
				})
				resolveRefreshWaiters()
				await runPostSignInInit()
			} catch (error) {
				rejectRefreshWaiters(
					error instanceof Error
						? error
						: new Error('Failed to complete Google sign-in'),
				)
				setGlobal({ isSignedIn: false, isSigningIn: false })
			}
		},
		[],
	)

	const handleTokenError = useCallback((error?: unknown) => {
		rejectRefreshWaiters(
			error instanceof Error
				? error
				: new Error('Google sign-in failed'),
		)
		setGlobal({ isSignedIn: false, isSigningIn: false })
	}, [])

	const login = useGoogleLogin({
		scope: SCOPES,
		onSuccess: handleTokenSuccess,
		onError: handleTokenError,
	})

	loginRef.current = login

	useEffect(() => {
		registerLoginTrigger((overrideConfig) => {
			loginRef.current?.(overrideConfig)
		})
	}, [])

	useEffect(() => {
		let cancelled = false

		async function initializeAuth() {
			setGlobal({ isSigningIn: true })

			try {
				await ensureGapiClient()

				const storedToken = loadStoredToken()
				if (storedToken) {
					applyTokenToGapiClient(storedToken.access_token)
					try {
						const userInfo = await fetchUserInfo(
							storedToken.access_token,
						)
						if (cancelled) {
							return
						}
						setGlobal({
							isSignedIn: true,
							isSigningIn: false,
							userId: userInfo.sub,
						})
						await runPostSignInInit()
						return
					} catch {
						clearAccessToken()
						clearCachedUserInfo()
						applyTokenToGapiClient(null)
					}
				}

				if (cancelled) {
					return
				}

				setGlobal({ isSignedIn: false, isSigningIn: false })
			} catch (error) {
				if (!cancelled) {
					console.error(error)
					setGlobal({ isSignedIn: false, isSigningIn: false })
				}
			}
		}

		void initializeAuth()

		return () => {
			cancelled = true
		}
	}, [])

	const signIn = useCallback(() => {
		setGlobal({ isSigningIn: true })
		loginRef.current?.()
	}, [])

	const signOut = useCallback(() => {
		const storedToken = loadStoredToken()
		if (storedToken?.access_token) {
			revokeAccessToken(storedToken.access_token)
		}

		clearAccessToken()
		clearCachedUserInfo()
		resetPostSignInInit()
		applyTokenToGapiClient(null)
		setGlobal({
			isSignedIn: false,
			isSigningIn: false,
			userId: '',
		})
	}, [])

	const value = useMemo(
		() => ({
			signIn,
			signOut,
			isReady: true,
		}),
		[signIn, signOut],
	)

	return (
		<GoogleAuthContext.Provider value={value}>
			{children}
		</GoogleAuthContext.Provider>
	)
}
