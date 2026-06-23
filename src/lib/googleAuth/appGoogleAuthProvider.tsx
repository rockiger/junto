import type { ReactNode } from 'react'

import { GoogleAuthProvider } from './googleAuthProvider'

type AppGoogleAuthProviderProps = {
	children: ReactNode
}

export function AppGoogleAuthProvider({ children }: AppGoogleAuthProviderProps) {
	return <GoogleAuthProvider>{children}</GoogleAuthProvider>
}
