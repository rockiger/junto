//@ts-check
import React from 'react'

import s from './card.module.scss'

export default Card
export { Card, CardBody, CardFooter, CardHeader }

/**
 * @typedef {Object.<string,any>} CardProps
 */

/**
 * A card component.
 * @param {CardProps} props
 */
function Card({ children }) {
    return <div className={s.Card}>{children}</div>
}

function CardHeader({ avatar, subtitle, title }) {
    return (
        <div className={s.CardHeader}>
            <div className={s.CardHeader_avatar}>{avatar}</div>
            <div className={s.CardHeader_main}>
                <div className={s.CardHeader_main_title}>{title}</div>
                <div className={s.CardHeader_main_subtitle}>{subtitle}</div>
            </div>
            <div className={s.CardHeader_action}></div>
        </div>
    )
}

function CardBody({ children }) {
    return <div className={s.CardBody}>{children}</div>
}

function CardFooter({ children }) {
    return <div className={s.CardFooter}>{children}</div>
}
