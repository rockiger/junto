import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'

import { IconButton } from 'components/gsuite-components'

export type PageButtonProps = Omit<
	ComponentPropsWithoutRef<typeof IconButton>,
	'tooltip' | 'selected'
> & {
	children: ReactNode
	title?: string
	active?: boolean
}

export function Button({
	children,
	id,
	onClick,
	className,
	style,
	title,
	type = 'button',
	active,
	...props
}: PageButtonProps) {
	return (
		<IconButton
			id={id}
			style={style}
			type={type}
			onClick={onClick}
			className={clsx(
				className,
				active &&
					'bg-icon-blue-lighter text-accent hover:bg-icon-blue-lighter hover:text-accent',
			)}
			tooltip={title}
			{...props}
		>
			{children}
		</IconButton>
	)
}
