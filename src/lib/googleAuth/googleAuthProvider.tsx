import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import { queryClient } from 'lib/query/query-client'
import { resetAppStore } from 'store/app-store'

import {
	applyTokenToGapiClient,
	ensureGapiClient,
	getGapiAuthInstance,
} from './gapiClient'
import {
	resetPostSignInInit,
	runPostSignInInit,
} from './postSignInInit'
import { clearCachedUserInfo, fetchUserInfo } from './userInfo'

export type AuthContext = {
	isSignedIn: boolean
	isSigningIn: boolean
	userId: string
	signIn: () => void
	signOut: () => void
	isReady: boolean
}

type GoogleAuthContextValue = AuthContext

const GoogleAuthContext = createContext<GoogleAuthContextValue | null>(null)

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
	const [isReady, setIsReady] = useState(false)
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [isSigningIn, setIsSigningIn] = useState(true)
	const [userId, setUserId] = useState('')

	const updateSignInStatus = useCallback(async (signedIn: boolean) => {
		if (signedIn) {
			try {
				const authResponse = getGapiAuthInstance()
					.currentUser.get()
					.getAuthResponse()
				applyTokenToGapiClient(authResponse.access_token)
				const userInfo = await fetchUserInfo(authResponse.access_token)
				setIsSignedIn(true)
				setIsSigningIn(false)
				setUserId(userInfo.sub)
				await runPostSignInInit()
			} catch (error) {
				console.error(error)
				setIsSignedIn(false)
				setIsSigningIn(false)
				setUserId('')
			}
			return
		}

		setIsSignedIn(false)
		setIsSigningIn(false)
		setUserId('')
	}, [])

	useEffect(() => {
		let cancelled = false

		async function initializeAuth() {
			setIsSigningIn(true)

			try {
				await ensureGapiClient()
				const authInstance = getGapiAuthInstance()

				authInstance.isSignedIn.listen((signedIn) => {
					if (cancelled) {
						return
					}
					void updateSignInStatus(signedIn)
				})

				if (cancelled) {
					return
				}

				await updateSignInStatus(authInstance.isSignedIn.get())
				setIsReady(true)
			} catch (error) {
				if (!cancelled) {
					console.error(error)
					setIsSignedIn(false)
					setIsSigningIn(false)
					setUserId('')
					setIsReady(false)
				}
			}
		}

		void initializeAuth()

		return () => {
			cancelled = true
		}
	}, [updateSignInStatus])

	const signIn = useCallback(() => {
		setIsSigningIn(true)
		void ensureGapiClient()
			.then(() => getGapiAuthInstance().signIn())
			.catch(() => {
				setIsSigningIn(false)
			})
	}, [])

	const signOut = useCallback(() => {
		clearCachedUserInfo()
		resetPostSignInInit()
		applyTokenToGapiClient(null)
		void ensureGapiClient()
			.then(() => getGapiAuthInstance().signOut())
			.catch((error) => {
				console.error(error)
			})
		setIsSignedIn(false)
		setIsSigningIn(false)
		setUserId('')
		queryClient.clear()
		resetAppStore()
	}, [])

	const value = useMemo(
		() => ({
			signIn,
			signOut,
			isReady,
			isSignedIn,
			isSigningIn,
			userId,
		}),
		[signIn, signOut, isReady, isSignedIn, isSigningIn, userId],
	)

	return (
		<GoogleAuthContext.Provider value={value}>
			{children}
		</GoogleAuthContext.Provider>
	)
}
