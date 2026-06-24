import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import { setAppState } from 'store/app-store'

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

type GoogleAuthContextValue = {
	signIn: () => void
	signOut: () => void
	isReady: boolean
}

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

	const updateSignInStatus = useCallback(async (isSignedIn: boolean) => {
		if (isSignedIn) {
			try {
				const authResponse = getGapiAuthInstance()
					.currentUser.get()
					.getAuthResponse()
				applyTokenToGapiClient(authResponse.access_token)
				const userInfo = await fetchUserInfo(authResponse.access_token)
				setAppState({
					isSignedIn: true,
					isSigningIn: false,
					userId: userInfo.sub,
				})
				await runPostSignInInit()
			} catch (error) {
				console.error(error)
				setAppState({ isSignedIn: false, isSigningIn: false })
			}
			return
		}

		setAppState({ isSignedIn: false, isSigningIn: false })
	}, [])

	useEffect(() => {
		let cancelled = false

		async function initializeAuth() {
			setAppState({ isSigningIn: true })

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
					setAppState({ isSignedIn: false, isSigningIn: false })
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
		setAppState({ isSigningIn: true })
		void ensureGapiClient()
			.then(() => getGapiAuthInstance().signIn())
			.catch(() => {
				setAppState({ isSigningIn: false })
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
		setAppState({
			isSignedIn: false,
			isSigningIn: false,
			userId: '',
		})
	}, [])

	const value = useMemo(
		() => ({
			signIn,
			signOut,
			isReady,
		}),
		[signIn, signOut, isReady],
	)

	return (
		<GoogleAuthContext.Provider value={value}>
			{children}
		</GoogleAuthContext.Provider>
	)
}
