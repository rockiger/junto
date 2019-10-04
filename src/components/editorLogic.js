import React, { useEffect, useState } from 'react'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'
import { isHotkey } from 'is-hotkey'

import MaterialEditor from './material-editor'
import { updateFile } from '../lib/gdrive'

import { LOCALSTORAGE_NAME } from '../lib/constants'
import { PageButtons, ToggleReadOnlyButton } from './pageButtons'

const isSaveHotkey = isHotkey('mod+Enter')

function EditorLogic({
    fileId,
    fileLoaded,
    initialValue,
    setEditorDelta,
    ...props
}) {
    const [readOnly, setReadOnly] = useState(true)
    const editor = React.createRef()
    const currentEditor = editor.current

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)

        return function cleanup() {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])

    useEffect(() => {
        return () => {
            if (currentEditor && !currentEditor.state.readOnly) {
                console.log('useEffect for save') // check if gets fired to often
                save(fileId, initialValue)
            }
        }
    }, [currentEditor, fileId, initialValue])

    const initialState = Value.fromJSON(JSON.parse(initialValue))
    initStorage(initialState)

    function onChange({ value }, setValue, oldValue) {
        if (value.document !== oldValue.document) {
            // check, if we really need to save changes
            const content = JSON.stringify(oldValue.toJSON())
            localStorage.setItem(LOCALSTORAGE_NAME, content)
        }
        setValue(value)
    }

    function onKeyDown(ev) {
        console.log('ev.key:', ev.key)
        console.log('readOnly:', readOnly)
        console.log('isSaveHotkeye:', isSaveHotkey(ev))
        if (ev.key === 'e' && readOnly === true) {
            ev.stopPropagation()
            ev.preventDefault()
            console.log('SetReadonly to false')
            setReadOnly(false)
            console.log(readOnly)
            //window.editorRef.current.focus()
        } else if (isSaveHotkey(ev) && readOnly === false) {
            ev.stopPropagation()
            ev.preventDefault()
            // this.props.save()
            console.log('SetReadonly to true')
            setReadOnly(true)
            // document.querySelector('.editor--toolbar').click()
        }
    }

    return (
        <>
            <PageButtons>
                <ToggleReadOnlyButton
                    readOnly={readOnly}
                    setReadOnly={setReadOnly}
                    onSave={() => {}}
                />
            </PageButtons>
            <MaterialEditor
                initialValue={initialState}
                onChangeHandler={onChange}
                ref={editor}
                readOnly={readOnly}
                save={() => save(fileId, initialValue)}
                style={{
                    fontSize: '1rem',
                    height: 'calc(100vh - 65px - 51px)',
                    padding: '.7rem 1rem .7rem .7rem',
                    overflowY: 'auto',
                }}
            />
            <Beforeunload
                onBeforeunload={() => {
                    if (editor.current && !!editor.current.state.readOnly) {
                        save(fileId, initialValue)
                    }
                }}
            />
        </>
    )
}

function initStorage(initialState) {
    const content = JSON.stringify(initialState.toJSON())
    localStorage.setItem(LOCALSTORAGE_NAME, content)
}
async function save(fileId, initialValue) {
    console.log('save()')
    const newValue = localStorage.getItem(LOCALSTORAGE_NAME)
    if (initialValue === newValue) {
        console.log('SAME SAME')
        return
    }

    // Extract text from document
    /* const document = Document.create(JSON.parse(newValue).document)
    const text = document
        .getTexts()
        .reduce((acc, currVal, currIndex, array) => {
            return `${acc} ${currVal.getText()}`
        }, '')
    console.log(text) */

    try {
        await updateFile(fileId, newValue)
        console.log('save:', fileId)
    } catch (err) {
        console.log("save: Couldn't save file with id:", fileId)
        console.log('Error:', err)
    }
}

export default EditorLogic
