import React, { useContext } from "react"
import {
    Disclosure as AriaDisclosure,
    DisclosurePanel as AriaDisclosurePanel,
    Button,
    DisclosureStateContext,
    Heading,
    type DisclosurePanelProps as AriaDisclosurePanelProps,
    type DisclosureProps as AriaDisclosureProps,
} from 'react-aria-components/Disclosure'
import ChevronRight from 'mdi-react/ChevronRightIcon'

import clsx from 'clsx'


export interface DisclosureProps extends AriaDisclosureProps {
    children: React.ReactNode
}

export function Disclosure({ children, ...props }: DisclosureProps) {
    return (
        <AriaDisclosure
            {...props}
            className={clsx(props.className, 'group min-w-50 font-sans rounded-lg text-neutral-900 dark:text-neutral-200')}
        >
            {children}
        </AriaDisclosure>
    )
}

export interface DisclosureHeaderProps {
    children: React.ReactNode
}

export function DisclosureHeader({ children }: DisclosureHeaderProps) {
    let { isExpanded } = useContext(DisclosureStateContext)!
    return (
        <Heading className="flex items-center text-lg font-semibold m-0">
            <Button
                slot="trigger"
                className="flex items-center gap-2 w-full justify-start font-medium">
                <ChevronRight aria-hidden className={clsx("w-6 h-6 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ease-in-out", isExpanded && 'transform rotate-90')} size={32} />
                <span>{children}</span>
            </Button>
        </Heading>
    )
}

export interface DisclosurePanelProps extends AriaDisclosurePanelProps {
    children: React.ReactNode
}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
    return (
        <AriaDisclosurePanel {...props} className={clsx(props.className, 'h-(--disclosure-panel-height) motion-safe:transition-[height] overflow-clip')}>
            <div className="py-2">{children}</div>
        </AriaDisclosurePanel>
    )
}
