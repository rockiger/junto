//@ts-check
import React from 'react'

import s from './style-helpers.module.scss'

export { HStack, Wikir, VStack }

function Wikir() {
    return <div className={s.Wikir}></div>
}

function HStack({ children }) {
    return <div className={s.HStack}>{children}</div>
}

function VStack({ children }) {
    return <div className={s.VStack}>{children}</div>
}
