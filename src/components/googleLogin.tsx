import ButtonUntyped from 'components/gsuite-components/button'
import IconButton from 'components/gsuite-components/icon-button'
import { useGoogleAuth } from 'lib/googleAuth'
import LogoutIcon from 'mdi-react/LogoutIcon'
import PropTypes from 'prop-types'
import type { ComponentType, MouseEvent } from 'react'

import { Event } from './Tracking'

const Button = ButtonUntyped as unknown as ComponentType<Record<string, unknown>>

type GoogleLoginProps = {
	buttonText?: string
}

export default function GoogleLogin({ buttonText = 'Login with Google' }: GoogleLoginProps) {
	const { isSignedIn, signIn, signOut, isReady } = useGoogleAuth()

	const handleAuthClick = () => {
		signIn()
		Event('Header', 'Sign In Button', '')
	}

	const handleSignoutClick = (event: MouseEvent) => {
		signOut()
		event.preventDefault()
		Event('Header', 'Sign Out Button', '')
	}

	if (isSignedIn) {
		return (
			<IconButton
				id="LogoutButton"
				onClick={handleSignoutClick}
				tooltip="Sign out"
			>
				<LogoutIcon />
			</IconButton>
		)
	}

	return (
		<span>
			<Button
				color="primary"
				edge="end"
				id="authorize_button"
				className="action"
				primary
				disabled={!isReady}
				onClick={handleAuthClick}
			>
				{buttonText ?? 'Login with Google'}
			</Button>
		</span>
	)
}

GoogleLogin.propTypes = {
	buttonText: PropTypes.node,
}
