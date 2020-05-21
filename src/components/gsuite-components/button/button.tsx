import React, { ReactElement } from 'react'

import styles from './button.module.scss'

export { Button }
export default Button

interface Props {
    children: ReactElement
    primary?: boolean
}

function Button({ children, ...props }: Props): ReactElement {
    return (
        <div {...props} className={styles.Button}>
            {children}
        </div>
    )
}
