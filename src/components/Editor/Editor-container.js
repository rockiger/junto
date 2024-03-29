import React, { useEffect, useGlobal, useState } from 'reactn'
import { Beforeunload } from 'react-beforeunload'
import { Value } from 'slate'
import { isHotkey } from 'is-hotkey'
import { useLocation } from 'react-router-dom'
import { debounce } from 'lodash'

import { Hint } from 'components/gsuite-components/hint'
import { PageButtons, ToggleReadOnlyButton } from 'components/pageButtons'
import { Event } from 'components/Tracking'
import { API_KEY } from 'lib/constants'
import { filesUpdater, getMetaById } from 'lib/helper'
import { updateMetadata } from 'lib/gdrive'

import MaterialEditor from './material-editor'
import {
    convertFilesToAutocompletItems,
    initStorage,
    save,
    updateModifiedTimeInGlobalState,
} from './Editor-helper'
import { PageMenu } from 'components/pageButtons/PageMenu'
import { ToggleStarredButton } from 'components/pageButtons/ToggleStarredButton'

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
        const [files, setFiles] = useGlobal('files')
        const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
        const { search } = useLocation()
        const [readOnly, setReadOnly] = useState(
            search === '?edit' ? false : true
        )
        const [height, setHeight] = useState('calc(100vh - 65px - 57px)')
        //const editorRef = useRef(null)

        const initialState = Value.fromJSON(JSON.parse(initialValue))

        useEffect(() => {
            async function onKeyDown(ev) {
                if (ev.key === 'e' && readOnly === true) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setReadOnly(false)
                    editorRef.current.focus()
                    Event('Editor', 'Activate Editor')
                } else if (isSaveHotkey(ev) && readOnly === false) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setReadOnly(true)
                    await saveToDriveAndLocalDB(fileId, initialValue)
                    Event('Editor', 'Deactivate Editor')
                }
            }
            window.addEventListener('keydown', onKeyDown)

            if (readOnly) {
                setHeight(`calc(100vh - 65px - 40px`)
            } else {
                setHeight(`calc(100vh - 65px - 40px - 43px)`)
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
            initStorage(initialValue, fileId)
            return async () => {
                console.log('useEffect for save') // check if gets fired to often
                await saveToDriveAndLocalDB(fileId, initialValue)
            }
            // eslint-disable-next-line
        }, [])

        useEffect(() => {}, [initialFiles, fileId])

        async function saveToDriveAndLocalDB(fileId, initialValue) {
            console.log('saveToDriveAndLocalDB')
            const { modifiedTime = undefined } = await save(
                fileId,
                initialValue
            )
            if (modifiedTime) {
                updateModifiedTimeInGlobalState(
                    fileId,
                    modifiedTime,
                    files,
                    setFiles,
                    initialFiles,
                    setInitialFiles
                )
            }
        }
        async function onClickToggleButton(ev) {
            ev.preventDefault()
            ev.stopPropagation()
            if (readOnly === true) {
                setReadOnly(false)
                setTimeout(() => editorRef.current.focus(), 100)
                Event('Editor', 'Activate Editor')
            } else if (readOnly === false) {
                setReadOnly(true)
                Event('Editor', 'Deactivate Editor')
                await saveToDriveAndLocalDB(fileId, initialValue)
            }
        }
        async function onChange({ value }, setValue, oldValue) {
            const changeLocalStorage = debounce(() => {
                if (value.document !== oldValue.document) {
                    // check, if we really need to save changes
                    const content = JSON.stringify(value.toJSON())
                    localStorage.setItem(fileId, content)
                }
            }, 300)
            changeLocalStorage()
            if (readOnly) {
                await saveToDriveAndLocalDB(fileId, initialValue)
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

        const star = async fileId => {
            console.log('star page')
            const updatedFiles = filesUpdater(
                { starred: true },
                { files, initialFiles },
                fileId
            )
            setFiles(updatedFiles.files)
            setInitialFiles(updatedFiles.initialFiles)
            //!
            await updateMetadata(fileId, { starred: true })
        }

        const unstar = async fileId => {
            console.log('unstar page')
            const updatedFiles = filesUpdater(
                { starred: false },
                { files, initialFiles },
                fileId
            )
            setFiles(updatedFiles.files)
            setInitialFiles(updatedFiles.initialFiles)
            //!
            await updateMetadata(fileId, { starred: false })
        }

        // TODO: Move to editor-component
        return (
            <div onKeyDown={onKeyDown}>
                {canEdit && (
                    <PageButtons>
                        <Hint id="edit_page" scope="wiki_page">
                            <ToggleReadOnlyButton
                                readOnly={readOnly}
                                onClick={onClickToggleButton}
                            />
                        </Hint>
                        <Hint id="star_page" scope="wiki_page">
                            <ToggleStarredButton
                                isStarred={_.thread(
                                    fileId,
                                    [getMetaById, initialFiles],
                                    [_.get, ['starred'], false]
                                )}
                                onClick={() => {
                                    if (
                                        getMetaById(fileId, initialFiles)[
                                            'starred'
                                        ]
                                    ) {
                                        unstar(fileId)
                                    } else {
                                        star(fileId)
                                    }
                                }}
                            />
                        </Hint>
                        <Hint id="page_menu" scope="wiki_page">
                            <PageMenu fileId={fileId} />
                        </Hint>
                    </PageButtons>
                )}
                <MaterialEditor
                    apiKey={API_KEY}
                    initialValue={initialState}
                    items={convertFilesToAutocompletItems(initialFiles)}
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
                    onBeforeunload={async () => {
                        if (
                            editorRef.current &&
                            !!editorRef.current.state.readOnly
                        ) {
                            await saveToDriveAndLocalDB(fileId, initialValue)
                        }
                    }}
                />
            </div>
        )
    }
)
export default EditorLogic
