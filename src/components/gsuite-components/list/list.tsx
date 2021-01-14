import React from 'react'
import clsx from 'clsx'

import { ButtonMenu } from 'components/ButtonMenu'

import s from './list.module.scss'

export interface ListProps {
    divided?: boolean
    children?: React.ReactNode
}
export function List({ children, divided = false }: ListProps) {
    return (
        <ul className={clsx(s.List, { [s.List__divided]: divided })}>
            {children}
        </ul>
    )
}

export interface ListItemProps {
    active?: boolean
    children?: React.ReactNode
    menu?: typeof ButtonMenu
    title?: string
}
export function ListItem({
    active = false,
    children,
    menu: Menu,
    title,
}: ListItemProps) {
    return (
        <li
            className={clsx(s.ListItem, {
                [s.ListItem__active]: active,
            })}
        >
            <figure className={s.ListItem_figure}>
                <div className={s.ListItem_figure_body}>
                    <figcaption>{title}</figcaption>
                    <div>{children}</div>
                </div>
                {Menu && (
                    <div>
                        <Menu />
                    </div>
                )}
            </figure>
        </li>
    )
}
