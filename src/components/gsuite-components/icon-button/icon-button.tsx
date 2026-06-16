import type { ReactNode } from 'react'
import clsx from 'clsx'
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
} from 'react-aria-components'

import { Tooltip } from 'components/gsuite-components/tooltip'

const baseClass =
	'relative box-border inline-flex size-10 min-w-0 cursor-pointer items-center justify-center overflow-visible rounded-full border border-transparent bg-transparent p-0.5 text-grey-700 outline-none transition-[color,background,transform] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-surface-alt hover:text-fg-default focus-visible:shadow-focus data-pressed:bg-[#e8f0fe] data-pressed:text-accent data-pressed:hover:bg-[#e8f0fe] data-pressed:hover:text-accent'

const selectedClass =
	'bg-[#e8f0fe] text-accent hover:bg-[#e8f0fe] hover:text-accent'

export interface IconButtonTriggerProps
	extends Omit<AriaButtonProps, 'className' | 'children'> {
	ariaLabel?: string
	children: ReactNode
	className?: string
	selected?: boolean
}

export function IconButtonTrigger({
	ariaLabel,
	children,
	className,
	selected,
	...rest
}: IconButtonTriggerProps) {
	return (
		<AriaButton
			{...rest}
			aria-label={ariaLabel}
			className={({ isPressed }) =>
				clsx(
					baseClass,
					(selected || isPressed) && selectedClass,
					className,
				)
			}
		>
			<span className="inline-flex leading-none">{children}</span>
		</AriaButton>
	)
}

export interface IconButtonProps extends IconButtonTriggerProps {
	tooltip?: string
}

export function IconButton({ tooltip, ...rest }: IconButtonProps) {
	return (
		<Tooltip content={tooltip}>
			<IconButtonTrigger {...rest} />
		</Tooltip>
	)
}

export default IconButton
