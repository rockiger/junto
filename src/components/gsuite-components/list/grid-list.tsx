import clsx from 'clsx'
import type { ComponentType, ReactNode } from 'react'
import {
    GridList as AriaGridList,
    GridListItem as AriaGridListItem,
    type GridListItemProps,
    type GridListProps,
    Text,
} from 'react-aria-components'

export interface ListProps<T extends object = object>
    extends Omit<GridListProps<T>, 'layout' | 'orientation' | 'selectionMode'> {
    divided?: boolean
    layout?: GridListProps<T>['layout']
    orientation?: GridListProps<T>['orientation']
    selectionMode?: GridListProps<T>['selectionMode']
}

export function List<T extends object = object>({
    children,
    className,
    divided = true,
    layout = 'stack',
    orientation = 'vertical',
    selectionMode = 'none',
    ...props
}: ListProps<T>) {
    return (
        <AriaGridList
            layout={layout}
            orientation={orientation}
            selectionMode={selectionMode}
            className={clsx('flex flex-col gap-2', className)}
            {...props}
        >
            {children}
        </AriaGridList>
    )
}

export interface ListItemProps<T extends object = object>
    extends Omit<GridListItemProps<T>, 'children' | 'textValue' | 'className'> {
    active?: boolean
    children?: ReactNode
    menu?: ComponentType
    title?: string
    textValue?: string
    className?: string
}

export function ListItem<T extends object = object>({
    active = false,
    children,
    className,
    menu: Menu,
    title,
    textValue: textValueProp,
    ...props
}: ListItemProps<T>) {
    const textValue =
        textValueProp ??
        title ??
        (typeof children === 'string' ? children : '')

    return (
        <AriaGridListItem
            textValue={textValue}
            className={clsx(
                'rounded-2xl bg-surface-paper',
                className
            )}
            {...props}
        >
            <div className="m-0 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    {title != null && title !== '' && (
                        <Text
                            className={clsx(
                                'block text-inherit',
                                active && 'font-bold'
                            )}
                        >
                            {title}
                        </Text>
                    )}
                    <div>{children}</div>
                </div>
                {Menu ? (
                    <div className="shrink-0">
                        <Menu />
                    </div>
                ) : null}
            </div>
        </AriaGridListItem>
    )
}
