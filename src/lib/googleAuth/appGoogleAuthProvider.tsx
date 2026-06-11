import { GoogleOAuthProvider } from '@react-oauth/google'
import { CLIENT_ID } from 'lib/constants'
import type { ReactNode } from 'react'

import { GoogleAuthProvider as GoogleAuthContextProvider } from './googleAuthProvider'

type AppGoogleAuthProviderProps = {
	children: ReactNode
}

export function AppGoogleAuthProvider({ children }: AppGoogleAuthProviderProps) {
	return (
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<GoogleAuthContextProvider>{children}</GoogleAuthContextProvider>
		</GoogleOAuthProvider>
	)
}
