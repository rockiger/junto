import React, { ReactElement } from 'react'

import styles from './button.module.scss'

interface Props {
    children: ReactElement
    primary?: boolean
}

export default function Button({ children, ...props }: Props): ReactElement {
    return (
        <div {...props} className={styles.Button}>
            {children}
        </div>
    )
}
