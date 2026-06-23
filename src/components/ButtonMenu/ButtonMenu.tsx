import clsx from 'clsx'
import { IconButtonTrigger } from 'components/gsuite-components/icon-button'
import { LinkButtonTrigger } from 'components/gsuite-components/link-button'
import { tooltipSurfaceClass } from 'components/gsuite-components/tooltip'
import CheckIcon from 'mdi-react/CheckIcon'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import { type ComponentType, type ReactNode, useState } from 'react'
import {
	Menu,
	MenuItem,
	MenuTrigger,
	Popover,
	Tooltip as AriaTooltip,
	TooltipTrigger,
	type PopoverProps,
} from 'react-aria-components'

export type ButtonMenuPosition = 'center' | 'left' | 'right'
export type ButtonMenuButtonType = 'IconButton' | 'LinkButton'

export interface ButtonMenuItem {
	key: string | number
	name: string
	handler?: () => void
	icon?: ComponentType<{ className?: string }>
	active?: boolean
}

export interface ButtonMenuProps {
	buttonType?: ButtonMenuButtonType
	children: ReactNode
	items: ButtonMenuItem[]
	position?: ButtonMenuPosition
	selectable?: boolean
	tooltip?: string
}

const placementByPosition: Record<ButtonMenuPosition, PopoverProps['placement']> = {
	left: 'bottom start',
	center: 'bottom',
	right: 'bottom end',
}

const menuItemClass =
	'flex cursor-default items-center gap-2 px-3 py-2 text-sm text-fg-default outline-none hover:bg-surface-hover focus:bg-surface-hover disabled:text-fg-disabled'

export function ButtonMenu({
	buttonType = 'IconButton',
	children,
	items,
	position = 'center',
	selectable = false,
	tooltip,
}: ButtonMenuProps) {
	const [isOpen, setIsOpen] = useState(false)

	const trigger =
		buttonType === 'LinkButton' ? (
			<LinkButtonTrigger
				ariaLabel={tooltip}
				selected={isOpen}
				Icon={MenuDownIcon}
			>
				{children}
			</LinkButtonTrigger>
		) : (
			<IconButtonTrigger ariaLabel={tooltip} selected={isOpen}>
				{children}
			</IconButtonTrigger>
		)

	return (
		<MenuTrigger onOpenChange={setIsOpen}>
			{tooltip ? (
				<TooltipTrigger closeDelay={200} delay={500}>
					{trigger}
					<AriaTooltip
						className={tooltipSurfaceClass}
						offset={4}
						placement="bottom"
					>
						<span>{tooltip}</span>
					</AriaTooltip>
				</TooltipTrigger>
			) : (
				trigger
			)}
			<Popover
				className="z-1000 min-w-[150px] rounded-md border border-edge bg-surface-paper shadow-lg outline-none"
				offset={0}
				placement={placementByPosition[position]}
			>
				<Menu className="max-h-[inherit] overflow-auto py-1 outline-none">
					{items.map(({ key, name, handler, icon: Icon, active }) => (
						<MenuItem
							key={key}
							className={menuItemClass}
							id={String(key)}
							textValue={name}
							onAction={() => handler?.()}
						>
							{selectable && (
								<span className="flex w-5 shrink-0 items-center justify-center">
									{active ? (
										<CheckIcon id="ButtenMenu-Checkmark" size={16} />
									) : null}
								</span>
							)}
							{Icon && !active && <Icon className="shrink-0" />}
							<span className={clsx('truncate', active && 'text-accent')}>
								{name}
							</span>
						</MenuItem>
					))}
				</Menu>
			</Popover>
		</MenuTrigger>
	)
}
