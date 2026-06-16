import type { ComponentType, ReactNode } from 'react'
import clsx from 'clsx'
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
} from 'react-aria-components'

import { Tooltip } from 'components/gsuite-components/tooltip'

const baseClass =
	'inline-flex cursor-pointer items-center rounded-lg border border-transparent bg-transparent px-2 py-1 text-[1.2rem] text-grey-700 outline-none transition-[color,background,transform] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-surface-alt hover:text-fg-default focus-visible:shadow-focus data-pressed:bg-[#e8f0fe] data-pressed:text-accent data-pressed:hover:bg-[#e8f0fe] data-pressed:hover:text-accent'

const selectedClass =
	'bg-[#e8f0fe] text-accent hover:bg-[#e8f0fe] hover:text-accent'

export interface LinkButtonTriggerProps
	extends Omit<AriaButtonProps, 'className' | 'children'> {
	ariaLabel?: string
	children: ReactNode
	Icon?: ComponentType<{ className?: string }>
	className?: string
	selected?: boolean
}

export function LinkButtonTrigger({
	ariaLabel,
	children,
	className,
	Icon,
	selected,
	...rest
}: LinkButtonTriggerProps) {
	return (
		<AriaButton
			{...rest}
			aria-label={ariaLabel}
			className={({ isPressed }) =>
				clsx(
					baseClass,
					Icon && 'pr-0',
					(selected || isPressed) && selectedClass,
					className,
				)
			}
		>
			{children}
			{Icon ? <Icon className="shrink-0" /> : null}
		</AriaButton>
	)
}

export interface LinkButtonProps extends LinkButtonTriggerProps {
	tooltip?: string
}

export function LinkButton({ tooltip, ...rest }: LinkButtonProps) {
	return (
		<Tooltip content={tooltip}>
			<LinkButtonTrigger {...rest} />
		</Tooltip>
	)
}

export default LinkButton
