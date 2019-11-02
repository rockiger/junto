import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import { SearchAutocomplete } from './SearchAutocomplete'
import testState from './testState.js'

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

storiesOf('SearchAutocomplete', module)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => <SearchAutocompleteDefault />)

const SearchAutocompleteDefault = () => {
    const { files } = testState
    console.log({ files })

    const [filteredFiles, setFilteredFiles] = useState(files)

    return (
        <Router>
            <SearchAutocomplete
                files={files}
                filteredFiles={filteredFiles}
                searchValue={''}
                setFilteredFiles={setFilteredFiles}
                setSubmitSelected={() => {}}
            />
        </Router>
    )
}
