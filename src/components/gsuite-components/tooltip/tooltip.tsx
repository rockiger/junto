import type { ReactElement } from 'react'
import {
	Tooltip as AriaTooltip,
	TooltipTrigger,
	type TooltipTriggerComponentProps,
} from 'react-aria-components'

const tooltipSurfaceClass =
	'box-border flex min-h-[22px] min-w-14 items-center justify-center rounded-[2px] border-0 bg-grey-700 px-2 py-[5px] text-center text-sm font-medium whitespace-nowrap text-white opacity-90 shadow-none'

export interface TooltipProps extends Omit<TooltipTriggerComponentProps, 'children'> {
	content?: string
	children: ReactElement
}

export function Tooltip({
	children,
	closeDelay = 200,
	content,
	delay = 500,
	...triggerProps
}: TooltipProps) {
	if (content == null || content === '') {
		return children
	}

	return (
		<TooltipTrigger {...triggerProps} closeDelay={closeDelay} delay={delay}>
			{children}
			<AriaTooltip className={tooltipSurfaceClass} offset={4} placement="bottom">
				{content}
			</AriaTooltip>
		</TooltipTrigger>
	)
}

export default Tooltip
