import React from 'react'

import s from './hint.module.scss'

interface Props {
    children: React.ReactNode
}

export const Hint = ({ children }: Props) => {
    return (
        <div className={s.hint__wrapper_outer}>
            {children}
            <div className={s.hint__wrapper_inner}>
                <div className={s.hint} />
            </div>
        </div>
    )
}
