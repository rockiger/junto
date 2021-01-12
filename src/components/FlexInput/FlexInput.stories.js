import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { FlexInput } from './FlexInput-container'

storiesOf('FlexInput', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => {
        const [value, setValue] = useState('Test')
        return (
            <FlexInput
                onBlur={() => {}}
                onChange={ev => setValue(ev.target.value)}
                onKeyDown={() => {}}
                value={value}
            />
        )
    })
