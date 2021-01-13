import React from 'react'
import { Interface } from 'readline'

export interface ListProps {
    children?: React.ReactNode
}
export function List({ children }: ListProps) {
    return <ul>{children}</ul>
}

export interface ListItemProps {
    children?: React.ReactNode
}
export function ListItem({ children }: ListItemProps) {
    return <li>{children}</li>
}
