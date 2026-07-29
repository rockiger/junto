import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button from './button'

storiesOf('Button', module)
	.addDecorator(story => (
		<div
			style={{
				display: 'flex',
				gap: '1rem',
				flexWrap: 'wrap',
				padding: '1rem',
				border: '1px solid rgba(0,0,0, 0.2)',
			}}
		>
			{story()}
		</div>
	))
	.add('default', () => <Button onPress={action('press')}>Sign up</Button>)
	.add('primary', () => (
		<Button variant="primary" onPress={action('press')}>
			Anmelden
		</Button>
	))
	.add('secondary', () => (
		<Button variant="secondary" onPress={action('press')}>
			Cancel
		</Button>
	))
	.add('quiet', () => (
		<Button variant="quiet" onPress={action('press')}>
			Sign up
		</Button>
	))
	.add('disabled', () => (
		<>
			<Button variant="primary" isDisabled>
				Anmelden
			</Button>
			<Button variant="secondary" isDisabled>
				Cancel
			</Button>
		</>
	))
	.add('pending', () => (
		<Button variant="primary" isPending onPress={action('press')}>
			Saving…
		</Button>
	))
