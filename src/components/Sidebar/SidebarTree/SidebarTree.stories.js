import React, { setGlobal } from 'reactn'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import { SidebarTreeItem } from './SidebarTreeItem'
import { useStyles } from './SidebarTree-styles'
import testState from './testState.js'

import { MYHOME } from '../../../lib/constants'

storiesOf('SidebarTree', module)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <div
            style={{
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', SidebarDefault)

function SidebarDefault() {
    const { files } = (window.testState = testState)
    const classes = useStyles()

    console.log(testState)
    return (
        <Router>
            <ul className={classes.mydrive}>
                <SidebarTreeItem
                    expand={true}
                    files={files}
                    label={MYHOME}
                    level={0}
                    pageId={'1vYllhFQojUFl9PpVRnW1uqJcPGigXF2D'}
                    parentId={'10t_Nrv_DUoOSbp9MoYGmfm1Cdj--Zc0D'}
                />
            </ul>
        </Router>
    )
}
