import React, { ReactElement } from 'react'
import classNames from 'classnames'

import styles from './icon-button.module.scss'

interface Props {
    ariaLabel?: string
    children: ReactElement
    className?: string
    onClick?: any
    selected?: boolean
}

export { IconButton }
export default function IconButton({
    ariaLabel,
    children,
    className,
    onClick,
    selected,
}: Props): ReactElement {
    return (
        <div
            arial-label={ariaLabel}
            className={classNames(
                styles.IconButton,
                className,
                selected && styles.IconButton__selected
            )}
            onClick={onClick}
            role="button"
        >
            <div className={styles.IconButton_inner}>{children}</div>
        </div>
    )
}
