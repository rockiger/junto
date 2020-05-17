import React, { useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import HelpIcon from 'mdi-react/HelpCircleOutlineIcon'

import IconButton from 'components/gsuite-components/icon-button'
import { Modal } from 'components/gsuite-components'

import s from './help.module.scss'
import Tab1Content from './tab-1-content'

export { Help }

export default function Help(props) {
    const [isOpen, setIsOpen] = useState(true)
    const [value, setValue] = useState(0)

    return (
        <>
            <IconButton id="HelpButton" onClick={toggle} selected={isOpen}>
                <HelpIcon />
            </IconButton>
            <Modal
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                closeModal={() => setIsOpen(false)}
                isOpen={isOpen}
                maxWidth="lg"
                title="Help"
            >
                <Tabs
                    className={s.Help_Tabs}
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                >
                    <Tab
                        index={0}
                        label="Fulcrum FAQ"
                        {...a11yProps(0)}
                        onClick={() => setValue(0)}
                        value={value}
                    />
                    <Tab
                        index={1}
                        label="Shortcuts"
                        {...a11yProps(1)}
                        onClick={() => setValue(1)}
                        value={value}
                    />
                    <Tab
                        index={2}
                        label="Editor Shortcuts"
                        {...a11yProps(2)}
                        onClick={() => setValue(2)}
                        value={value}
                    />
                    <Tab
                        index={3}
                        label="Editor Completions"
                        {...a11yProps(3)}
                        onClick={() => setValue(3)}
                        value={value}
                    />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Tab1Content />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Item Four
                </TabPanel>
            </Modal>
        </>
    )

    function handleChange(event, newValue) {
        setValue(newValue)
    }

    function toggle() {
        setIsOpen(!isOpen)
    }
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

function Tabs({ children, ...rest }) {
    return <div {...rest}>{children}</div>
}

function Tab({ index, label, onClick, value }) {
    return (
        <div className={s.Tab} onClick={onClick}>
            {index === value ? (
                <span className={`${s.Tab_Label} ${s.Tab_Label__selected}`}>
                    {label}
                </span>
            ) : (
                <span className={`${s.Tab_Label}`}>{label}</span>
            )}
        </div>
    )
}
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            className={s.TabPanel}
            {...other}
        >
            {value === index && <Typography>{children}</Typography>}
        </div>
    )
}
