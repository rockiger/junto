// @ts-nocheck

import { useLocation } from '@tanstack/react-router'
import { Hint } from 'components/gsuite-components/hint'
import { PageButtons, ToggleReadOnlyButton } from 'components/pageButtons'
import { PageMenu } from 'components/pageButtons/PageMenu'
import { ToggleStarredButton } from 'components/pageButtons/ToggleStarredButton'
import { Event } from 'components/Tracking'
import { isHotkey } from 'is-hotkey'
import { API_KEY } from 'lib/constants'
import { updateMetadata } from 'lib/gdrive'
import { filesUpdater, getMetaById } from 'lib/helper'
import {
    PAGE_WIDTH_FULL,
    PAGE_WIDTH_REDUCED,
    parsePageContent,
    serializePageContent,
    type PageWidth,
} from 'lib/pageWidth'
import { debounce } from 'lodash'
import { Beforeunload } from 'react-beforeunload'
import React, {
    useCallback,
    useEffect,
    useGlobal,
    useMemo,
    useRef,
    useState,
} from 'reactn'
import {
    convertFilesToAutocompletItems,
    initStorage,
    save,
    updateModifiedTimeInGlobalState,
} from './Editor-helper'
import LexicalWikiEditor from './lexical'

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
        const { searchStr } = useLocation()
        const hasEdit =
            searchStr === '?edit' ||
            (searchStr.startsWith('?') &&
                new URLSearchParams(searchStr.slice(1)).has('edit'))
        const [readOnly, setReadOnly] = useState(!hasEdit)
        const [_height, setHeight] = useState('calc(100vh - 65px - 57px)')
        const [{ body: initialBody, pageWidth: initialPageWidth }] = useState(
            () => parsePageContent(initialValue)
        )
        const [pageWidth, setPageWidth] = useState<PageWidth>(initialPageWidth)
        const pageWidthRef = useRef(pageWidth)
        //const editorRef = useRef(null)

        useEffect(() => {
            pageWidthRef.current = pageWidth
        }, [pageWidth])

        useEffect(() => {
            const parsed = parsePageContent(initialValue)
            setPageWidth(parsed.pageWidth)
        }, [fileId, initialValue])

        useEffect(() => {
            async function onKeyDown(ev) {
                if (ev.key === 'e' && readOnly === true) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setReadOnly(false)
                    editorRef.current.focus()
                    Event('Editor', 'Activate Editor', 'Keyboard Shortcut')
                } else if (isSaveHotkey(ev) && readOnly === false) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setReadOnly(true)
                    await saveToDriveAndLocalDB(fileId, initialValue)
                    Event('Editor', 'Deactivate Editor', 'Keyboard Shortcut')
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

        useEffect(() => { }, [initialFiles, fileId])

        async function saveToDriveAndLocalDB(fileId, initialValue) {
            console.log('saveToDriveAndLocalDB')
            onChangeMarkdown.flush()
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
                Event('Editor', 'Activate Editor', 'Button')
            } else if (readOnly === false) {
                setReadOnly(true)
                Event('Editor', 'Deactivate Editor', 'Button')
                await saveToDriveAndLocalDB(fileId, initialValue)
            }
        }
        const saveChecklistChanges = useMemo(
            () =>
                debounce(() => {
                    saveToDriveAndLocalDB(fileId, initialValue)
                }, 500),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [fileId, initialValue]
        )

        useEffect(() => {
            return () => {
                saveChecklistChanges.cancel()
            }
        }, [saveChecklistChanges])

        const onChangeMarkdown = useMemo(
            () =>
                debounce(markdown => {
                    localStorage.setItem(fileId, markdown)
                }, 300),
            [fileId]
        )

        const handleMarkdownChange = useCallback(
            markdown => {
                const full = serializePageContent(markdown, pageWidthRef.current)
                onChangeMarkdown(full)
                if (readOnly && canEdit) {
                    saveChecklistChanges()
                }
            },
            [canEdit, onChangeMarkdown, readOnly, saveChecklistChanges]
        )

        const handlePageWidthChange = useCallback(
            (nextPageWidth: PageWidth) => {
                setPageWidth(nextPageWidth)
                pageWidthRef.current = nextPageWidth
                onChangeMarkdown.flush()
                const stored = localStorage.getItem(fileId) || ''
                const { body } = parsePageContent(stored)
                const full = serializePageContent(body, nextPageWidth)
                localStorage.setItem(fileId, full)
                saveToDriveAndLocalDB(fileId, initialValue)
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [fileId, initialValue, onChangeMarkdown]
        )

        const handlePageWidthToggle = useCallback(() => {
            const nextPageWidth =
                pageWidth === PAGE_WIDTH_FULL
                    ? PAGE_WIDTH_REDUCED
                    : PAGE_WIDTH_FULL
            if (canEdit) {
                handlePageWidthChange(nextPageWidth)
            } else {
                setPageWidth(nextPageWidth)
                pageWidthRef.current = nextPageWidth
            }
        }, [canEdit, handlePageWidthChange, pageWidth])

        const onKeyDown = ev => {
            if (!readOnly) {
                if (isSaveHotkey(ev)) return
                ev.stopPropagation()
            }
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
                <PageButtons>
                    {canEdit && (
                        <>
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
                                            getMetaById(fileId, initialFiles)
                                                .starred
                                        ) {
                                            unstar(fileId)
                                        } else {
                                            star(fileId)
                                        }
                                    }}
                                />
                            </Hint>
                        </>
                    )}
                    <Hint id="page_menu" scope="wiki_page">
                        <PageMenu
                            canEdit={canEdit}
                            fileId={fileId}
                            onPageWidthToggle={handlePageWidthToggle}
                            pageWidth={pageWidth}
                        />
                    </Hint>
                </PageButtons>
                <LexicalWikiEditor
                    apiKey={API_KEY}
                    canEdit={canEdit}
                    fileId={fileId}
                    initialValue={initialBody}
                    items={convertFilesToAutocompletItems(initialFiles)}
                    onChangeMarkdown={handleMarkdownChange}
                    pageWidth={pageWidth}
                    ref={editorRef}
                    readOnly={readOnly}
                    style={{
                        fontSize: '1rem',
                        //! height,
                        padding: "0 1.25rem",
                        overflowY: 'auto',
                    }}
                />
                {canEdit && !readOnly && (
                    <Beforeunload
                        onBeforeunload={async () => {
                            saveChecklistChanges.flush()
                            onChangeMarkdown.flush()
                            await saveToDriveAndLocalDB(fileId, initialValue)
                        }}
                    />
                )}
            </div>
        )
    }
)
export default EditorLogic
