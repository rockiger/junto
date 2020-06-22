import React from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import clsx from 'clsx'
import './tabs.scss'
export { Tab, TabList, TabPanel } from 'react-tabs'

export function Tabs(props) {
    const className = props.vertical ? 'react-tabs-vertical' : 'react-tabs'
    return <ReactTabs {...props} className={clsx(className, props.className)} />
}
