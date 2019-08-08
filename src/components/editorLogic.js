import React, { useEffect } from 'react'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'

import MaterialEditor from './material-editor'
import { updateFile } from '../lib/gdrive'

import { LOCALSTORAGE_NAME } from '../lib/constants'

function EditorLogic({
    fileId,
    fileLoaded,
    initialValue,
    setEditorDelta,
    ...props
}) {
    const editor = React.createRef()
    const currentEditor = editor.current

    useEffect(() => {
        return () => {
            if (currentEditor && !currentEditor.state.readOnly) {
                console.log('useEffect for save')
                save(fileId, initialValue)
            }
        }
    }, [currentEditor, fileId, initialValue])

    const initialState = Value.fromJSON(JSON.parse(initialValue))
    initStorage(initialState)

    function onChange(newValue) {
        // check, if we really need to save changes
        if (editor.current && editor.current.state.value === newValue) {
            console.log('onChange:', editor.current.state)
            return
        }
        const content = JSON.stringify(newValue.toJSON())
        localStorage.setItem(LOCALSTORAGE_NAME, content)
    }

    return (
        <>
            <MaterialEditor
                initialState={initialState}
                onChange={onChange}
                ref={editor}
                save={() => save(fileId, initialValue)}
                style={{
                    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
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

    console.log('newValue:', newValue)
    console.log('initialValue:', initialValue)
    if (initialValue === newValue) {
        console.log('SAME SAME')
        return
    }
    try {
        await updateFile(fileId, newValue)
        console.log('save:', fileId)
    } catch (err) {
        console.log("save: Couldn't save file with id:", fileId)
        console.log('Error:', err)
    }
}

export default EditorLogic
