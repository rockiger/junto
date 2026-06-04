import { ComponentType, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'
import { Tooltip } from 'components/gsuite-components/tooltip'
import s from './link-button.module.scss'

interface Props {
    ariaLabel?: string
    children: ReactNode
    Icon?: ComponentType<{ className?: string }>
    className?: string
    id?: string
    onClick?: any
    selected?: boolean
    tooltip?: string
}

export { LinkButton }
export default function LinkButton({
    ariaLabel,
    children,
    className,
    Icon,
    onClick,
    selected,
    tooltip,
    ...rest
}: Props): ReactElement {
    return (
        <Tooltip content={tooltip}>
            <button
                {...rest}
                arial-label={ariaLabel}
                className={clsx(
                    s.LinkButton,
                    className,
                    selected && s.LinkButton__selected
                )}
                onClick={onClick}
                style={{ paddingRight: Icon ? 0 : undefined }}
            >
                {children}{Icon ? <Icon /> : null}
            </button>
        </Tooltip>
    )
}
