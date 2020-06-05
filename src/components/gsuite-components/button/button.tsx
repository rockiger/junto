import React, { ReactElement } from 'react'
import clsx from 'clsx'

import s from './button.module.scss'

export { Button }
export default Button

interface Props {
    children: ReactElement | string
    primary?: boolean
}

function Button({ children, primary, ...props }: Props): ReactElement {
    return (
        <div
            {...props}
            className={clsx(s.Button, { [s.Button__primary]: primary })}
        >
            {children}
        </div>
    )
}
