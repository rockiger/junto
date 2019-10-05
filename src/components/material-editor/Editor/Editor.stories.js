import React, { useRef } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Value } from 'slate'

import Editor from './Editor-container.js'

import codeValueAsJson from './codevalue.json'
import checkListValueAsJson from './checkListValue.json'

const codeValue = Value.fromJSON(codeValueAsJson)
const checkListValue = Value.fromJSON(checkListValueAsJson)

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        text: 'A line of text in a paragraph.',
                    },
                ],
            },
        ],
    },
})
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

const existingValue = JSON.parse(localStorage.getItem('content'))
const localStorageValue = existingValue
    ? Value.fromJSON(existingValue)
    : initialValue

const externalLinkValue = Value.fromJSON({
    object: 'value',
    document: {
        object: 'document',
        data: {},
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    { object: 'text', text: '', marks: [] },
                    {
                        object: 'inline',
                        type: 'link',
                        data: { href: 'https://spiegel.de' },
                        nodes: [
                            {
                                object: 'text',
                                text: 'External-Link',
                                marks: [],
                            },
                        ],
                    },
                    { object: 'text', text: '', marks: [] },
                ],
            },
        ],
    },
})

function EditorWithRef(props) {
    const editorRef = useRef(null)
    return <Editor ref={editorRef} {...props} />
}

storiesOf('Editor', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => {
        const editorRef = useRef(null)
        return <Editor initialValue={initialValue} ref={editorRef} />
    })
    .add('empty', () => <EditorWithRef />)
    .add('with autocomplete items', () => <EditorWithRef items={items} />)
    .add('Code node', () => <EditorWithRef initialValue={codeValue} />)
    .add('localStorage', () => (
        <EditorWithRef
            initialValue={localStorageValue}
            onChangeHandler={({ value }, setValue, oldValue) => {
                // Save the value to Local Storage.
                if (value.document !== oldValue.document) {
                    console.log('save text')
                    const content = JSON.stringify(value.toJSON())
                    localStorage.setItem('content', content)
                }

                setValue(value)
            }}
        />
    ))
    .add('External Link', () => (
        <EditorWithRef initialValue={externalLinkValue} />
    ))
    .add('Check List', () => <EditorWithRef initialValue={checkListValue} />)
