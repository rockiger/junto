import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import LinkAutocomplete from './LinkAutocomplete'

const items = [
    {
        id: '1',
        icon: () => (
            <img
                style={{
                    verticalAlign: 'sub',
                }}
                src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                alt="Wiki File"
            />
        ),
        href: 'https://spielgel.de',
        name: 'Test 1',
    },
    {
        id: '2',
        icon: () => (
            <img
                style={{
                    verticalAlign: 'sub',
                }}
                src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                alt="Wiki File"
            />
        ),
        href: 'https://faz.net',
        name: 'Test 2',
    },
]

storiesOf('LinkAutocomplete', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => <LinkAutocomplete items={[]} />)
    .add('withItems', () => <LinkAutocomplete items={items} />)
