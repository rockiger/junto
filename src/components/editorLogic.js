import React, { useEffect, useState, useRef } from 'react'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'
import { isHotkey } from 'is-hotkey'

import MaterialEditor from './material-editor'
import FulcrumLogo from './FulcrumLogo'
import { PageButtons, ToggleReadOnlyButton } from './pageButtons'

import { getState } from '../state'
import { updateFile } from '../lib/gdrive'
import { getExtFromFileName, getTitleFromFileName } from '../lib/helper'
import { LOCALSTORAGE_NAME, API_KEY, EXT } from '../lib/constants'

const isSaveHotkey = isHotkey('mod+Enter')

function EditorLogic({
    fileId,
    fileLoaded,
    initialValue,
    setEditorDelta,
    ...props
}) {
    const [{ files }] = getState()
    const [readOnly, setReadOnly] = useState(true)
    const editorRef = useRef(null)
    const currentEditor = editorRef.current
    window.editorRef = editorRef

    useEffect(() => {
        function onKeyDown(ev) {
            if (ev.key === 'e' && readOnly === true) {
                ev.stopPropagation()
                ev.preventDefault()
                setReadOnly(false)
                editorRef.current.focus()
            } else if (isSaveHotkey(ev) && readOnly === false) {
                ev.stopPropagation()
                ev.preventDefault()
                save(fileId, initialValue)
                setReadOnly(true)
            }
        }
        window.addEventListener('keydown', onKeyDown)

        return function cleanup() {
            window.removeEventListener('keydown', onKeyDown)
        }
        // eslint-disable-next-line
    }, [readOnly])

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

    function onClickToggleButton(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (readOnly === true) {
            setReadOnly(false)
            setTimeout(() => editorRef.current.focus(), 100)
        } else if (readOnly === false) {
            save(fileId, initialValue)
            setReadOnly(true)
        }
    }
    function onChange({ value }, setValue, oldValue) {
        if (value.document !== oldValue.document) {
            // check, if we really need to save changes
            const content = JSON.stringify(value.toJSON())
            localStorage.setItem(LOCALSTORAGE_NAME, content)
        }
        setValue(value)
    }

    return (
        <>
            <PageButtons>
                <ToggleReadOnlyButton
                    readOnly={readOnly}
                    onClick={onClickToggleButton}
                />
            </PageButtons>
            <MaterialEditor
                apiKey={API_KEY}
                initialValue={initialState}
                items={convertFilesToAutocompletItems(files)}
                onChangeHandler={onChange}
                ref={editorRef}
                readOnly={readOnly}
                style={{
                    fontSize: '1rem',
                    height: 'calc(100vh - 65px - 51px)',
                    padding: '.7rem 1rem .7rem .7rem',
                    overflowY: 'auto',
                }}
            />
            <Beforeunload
                onBeforeunload={() => {
                    if (
                        editorRef.current &&
                        !!editorRef.current.state.readOnly
                    ) {
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

function convertFilesToAutocompletItems(files) {
    if (files && files.map) {
        const items = files
            .filter(file => {
                const ext = getExtFromFileName(file.name)
                return ext === EXT
            })
            .map(file => {
                return {
                    href: `/page/${file.id}`,
                    id: file.id,
                    icon: FulcrumLogo,
                    name: getTitleFromFileName(file.name),
                }
            })
        return items
    }
}
export default EditorLogic
