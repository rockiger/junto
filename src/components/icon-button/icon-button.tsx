import React, { ReactElement } from 'react'
import classNames from 'classnames'

import styles from './icon-button.module.scss'

interface Props {
    ariaLabel?: string
    children: ReactElement
    className?: string
    onClick?: () => void
}

export default function Button({
    ariaLabel,
    children,
    className,
    onClick,
}: Props): ReactElement {
    return (
        <div
            arial-label={ariaLabel}
            className={classNames(styles.IconButton, className)}
            onClick={onClick}
            role="button"
        >
            <div className={styles.IconButton_wrapper}>{children}</div>
        </div>
    )
}
