import React from 'react'
import { Tabs } from 'react-tabs'
import clsx from 'clsx'

import './vertical-tabs.scss'

export function VerticalTabs(props) {
    return (
        <Tabs
            {...props}
            className={clsx('react-tabs-vertical', props.className)}
        />
    )
}
