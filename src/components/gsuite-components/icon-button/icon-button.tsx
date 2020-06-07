import React, { ReactElement } from 'react'
import clsx from 'clsx'
import { Tooltip } from 'components/gsuite-components/tooltip'
import s from './icon-button.module.scss'

interface Props {
    ariaLabel?: string
    children: ReactElement
    className?: string
    onClick?: any
    selected?: boolean
    tooltip?: string
}

export { IconButton }
export default function IconButton({
    ariaLabel,
    children,
    className,
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
                    s.IconButton,
                    className,
                    selected && s.IconButton__selected
                )}
                onClick={onClick}
            >
                <div className={s.IconButton_inner}>{children}</div>
            </button>
        </Tooltip>
    )
}
