import React, { useEffect, useGlobal, useState } from 'reactn'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'
import { isHotkey } from 'is-hotkey'
import { useLocation } from 'react-router-dom'

import {
    PageButtons,
    ToggleReadOnlyButton,
    ShareButton,
} from 'components/pageButtons'
import { Event } from 'components/Tracking'
import { API_KEY, OVERVIEW_NAME } from 'lib/constants'

import MaterialEditor from './material-editor'
import {
    convertFilesToAutocompletItems,
    initStorage,
    save,
} from './Editor-helper'

const isSaveHotkey = isHotkey('mod+Enter')

const EditorLogic = React.forwardRef(
    (
        {
            canEdit,
            fileId,
            fileLoaded,
            fileName,
            initialValue,
            inputRef,
            setEditorDelta,
            ...props
        },
        editorRef
    ) => {
        const [files] = useGlobal('initialFiles')
        const { search } = useLocation()
        const [readOnly, setReadOnly] = useState(
            search === '?edit' ? false : true
        )
        const [height, setHeight] = useState('calc(100vh - 65px - 57px)')
        //const editorRef = useRef(null)

        const currentEditor = editorRef.current
        const initialState = Value.fromJSON(JSON.parse(initialValue))

        useEffect(() => {
            function onKeyDown(ev) {
                if (ev.key === 'e' && readOnly === true) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setReadOnly(false)
                    editorRef.current.focus()
                    Event('Editor', 'Activate Editor')
                } else if (isSaveHotkey(ev) && readOnly === false) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    save(fileId, initialValue)
                    setReadOnly(true)
                    Event('Editor', 'Deactivate Editor')
                }
            }
            window.addEventListener('keydown', onKeyDown)

            const breadcrumbHeight = fileName === OVERVIEW_NAME ? 0 : 37
            if (readOnly) {
                setHeight(`calc(100vh - 65px - 57px - ${breadcrumbHeight}px)`)
            } else {
                setHeight(
                    `calc(100vh - 65px - 57px - ${breadcrumbHeight}px - 43px)`
                )
                setTimeout(() => {
                    if (editorRef.current) editorRef.current.focus()
                }, 100)
            }

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

        useEffect(() => {
            initStorage(initialValue, fileId)
            // eslint-disable-next-line
        }, [])

        useEffect(() => {}, [files, fileId])

        function onClickToggleButton(ev) {
            ev.preventDefault()
            ev.stopPropagation()
            if (readOnly === true) {
                setReadOnly(false)
                setTimeout(() => editorRef.current.focus(), 100)
                Event('Editor', 'Activate Editor')
            } else if (readOnly === false) {
                save(fileId, initialValue)
                setReadOnly(true)
                Event('Editor', 'Deactivate Editor')
            }
        }
        function onChange({ value }, setValue, oldValue) {
            if (value.document !== oldValue.document) {
                // check, if we really need to save changes
                const content = JSON.stringify(value.toJSON())
                localStorage.setItem(fileId, content)
                if (readOnly) {
                    save(fileId, initialValue)
                }
            }
            setValue(value)
        }

        const onKeyDown = ev => {
            if (!readOnly) {
                if (isSaveHotkey(ev)) return
                ev.stopPropagation()
            }
        }
        const onKeyDownEditor = (event, editor, next) => {
            if (event.key === 'Tab' && event.shiftKey) {
                event.preventDefault()
                inputRef.current.focus()
                return
            }

            return next()
        }

        // TODO: Move to editor-component
        return (
            <div onKeyDown={onKeyDown}>
                <PageButtons>
                    {canEdit && <ShareButton fileId={fileId} />}
                    {canEdit && (
                        <ToggleReadOnlyButton
                            readOnly={readOnly}
                            onClick={onClickToggleButton}
                        />
                    )}
                </PageButtons>
                <MaterialEditor
                    apiKey={API_KEY}
                    initialValue={initialState}
                    items={convertFilesToAutocompletItems(files)}
                    onChangeHandler={onChange}
                    onKeyDownHandler={onKeyDownEditor}
                    ref={editorRef}
                    readOnly={readOnly}
                    style={{
                        fontSize: '1rem',
                        height,
                        padding: `.7rem 1rem ${
                            !readOnly ? '20rem' : '.7rem'
                        } .7rem`,
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
            </div>
        )
    }
)
export default EditorLogic
