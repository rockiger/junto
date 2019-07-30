import React, { useState, useEffect } from 'react'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'

import MaterialEditor from './material-editor'
import { getFolderId, listFiles, updateFile } from '../lib/gdrive'

import {
    API_KEY,
    EMPTYVALUE,
    UNTITLEDFILE,
    UNTITLEDNAME,
    EXT,
    LOCALSTORAGE_NAME,
} from '../lib/constants'

function EditorLogic({
    fileId,
    fileLoaded,
    initialValue,
    setEditorDelta,
    ...props
}) {
    const [fileName, setFileName] = useState(UNTITLEDFILE)
    const [pageHead, setPageHead] = useState(UNTITLEDNAME)
    //const [fileLoaded, setFileLoaded] = useState(false);

    useEffect(() => {
        return () => {
            save(fileId, initialValue)
        }
    }, [])

    const initialState = Value.fromJSON(JSON.parse(initialValue))
    initStorage(initialState)
    const ref = React.createRef()

    function onChange(newValue) {
        // check, if we really need to save changes
        if (ref.current && ref.current.state.value == newValue) {
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
                ref={ref}
                style={{
                    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                    fontSize: '1rem',
                    height: 'calc(100vh - 65px - 51px)',
                    padding: '.7rem 1rem .7rem .7rem',
                    overflowY: 'auto',
                }}
            />
            <Beforeunload onBeforeunload={() => save(fileId, initialValue)} />
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

function compare(obj1, obj2) {
    return (
        Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(
            key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
        )
    )
}
export default EditorLogic
