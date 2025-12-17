//@ts-check
import React from 'react'

import s from './style-helpers.module.scss'

export { HStack, Spacer, VStack }

function Spacer() {
    return <div className={s.Spacer}></div>
}

function HStack({ children }) {
    return <div className={s.HStack}>{children}</div>
}

function VStack({ children }) {
    return <div className={s.VStack}>{children}</div>
}
