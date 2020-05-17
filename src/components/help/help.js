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
import {
    Modal,
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from 'components/gsuite-components'

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
                fullHeight
                maxWidth="lg"
                title="Help"
            >
                <Tabs>
                    <TabList>
                        <Tab>Fulcrum FAQ</Tab>
                        <Tab>Shortcuts</Tab>
                        <Tab>Editor Shortcuts</Tab>
                        <Tab>Editor Completions</Tab>
                    </TabList>

                    <TabPanel>
                        <Tab1Content />
                    </TabPanel>
                </Tabs>
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
