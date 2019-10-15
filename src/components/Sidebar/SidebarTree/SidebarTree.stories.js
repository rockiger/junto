import React, { setGlobal } from 'reactn'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import { SidebarTree } from './SidebarTree-container'

import testState from './testState.js'

setGlobal(testState)
window.testState = testState
console.log(testState)

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
    return <SidebarTree />
}
