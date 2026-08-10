// @ts-nocheck

import { useLocation } from '@tanstack/react-router'
import { Hint } from 'components/gsuite-components/hint'
import Alert from 'components/gsuite-components/alert/alert'
import { PageButtons, ToggleReadOnlyButton } from 'components/pageButtons'
import { PageMenu } from 'components/pageButtons/PageMenu'
import { ToggleStarredButton } from 'components/pageButtons/ToggleStarredButton'
import { Event } from 'components/Tracking'
import { isHotkey } from 'is-hotkey'
import { API_KEY } from 'lib/constants'
import { updateMetadata } from 'lib/gdrive'
import { getMetaById } from 'lib/helper'
import {
    PAGE_WIDTH_FULL,
    PAGE_WIDTH_REDUCED,
    type PageWidth,
    parsePageContent,
    serializePageContent,
} from 'lib/pageWidth'
import { patchFileCaches } from 'lib/query/files-cache'
import { useFileTree } from 'lib/query/files-queries'
import { queryClient } from 'lib/query/query-client'
import { debounce } from 'lodash'
import { useSnackbar } from 'notistack'
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Beforeunload } from 'react-beforeunload'
import {
    convertFilesToAutocompletItems,
    initStorage,
    save,
} from './Editor-helper'
import LexicalWikiEditor from './lexical'

const isSaveHotkey = isHotkey('mod+Enter')

const EditorLogic = React.forwardRef(
    (
        {
            canEdit,
            checkRemoteUpdate,
            contentReloadKey = 0,
            fileId,
            fileLoaded,
            fileName,
            initialValue,
            inputRef,
            knownRemoteModifiedTimeRef,
            onReloadFromRemote,
            setEditorDelta,
            ...props
        },
        editorRef
    ) => {
        const { data: initialFiles = [] } = useFileTree()
        const { enqueueSnackbar } = useSnackbar()
        const { searchStr } = useLocation()
        const hasEdit =
            searchStr === '?edit' ||
            (searchStr.startsWith('?') &&
                new URLSearchParams(searchStr.slice(1)).has('edit'))
        const [readOnly, setReadOnly] = useState(!hasEdit)
        const [reloadConfirmOpen, setReloadConfirmOpen] = useState(false)
        const [_height, setHeight] = useState('calc(100dvh - 65px - 57px)')
        const [{ pageWidth: initialPageWidth }] = useState(
            () => parsePageContent(initialValue)
        )
        const [pageWidth, setPageWidth] = useState<PageWidth>(initialPageWidth)
        const pageWidthRef = useRef(pageWidth)
        const checkingRemoteUpdateRef = useRef(false)
        const lastRemoteCheckRef = useRef(0)
        const readOnlyRef = useRef(readOnly)
        //const editorRef = useRef(null)

        useEffect(() => {
            readOnlyRef.current = readOnly
        }, [readOnly])

        const editorBody = parsePageContent(initialValue).body

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
                setHeight(`calc(100dvh - 65px - 40px`)
            } else {
                setHeight(`calc(100dvh - 65px - 40px - 43px)`)
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
                if (knownRemoteModifiedTimeRef) {
                    knownRemoteModifiedTimeRef.current = modifiedTime
                }
                patchFileCaches(queryClient, {}, fileId)
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

        useEffect(() => {
            if (contentReloadKey === 0) return
            initStorage(initialValue, fileId)
            onChangeMarkdown.cancel()
            saveChecklistChanges.cancel()
        }, [contentReloadKey, fileId, initialValue, onChangeMarkdown, saveChecklistChanges])

        useEffect(() => {
            if (!fileLoaded || !checkRemoteUpdate || !onReloadFromRemote) {
                return
            }

            const handleRefocus = async () => {
                if (document.visibilityState !== 'visible') return
                if (reloadConfirmOpen) return

                const now = Date.now()
                if (now - lastRemoteCheckRef.current < 1000) return
                if (checkingRemoteUpdateRef.current) return

                checkingRemoteUpdateRef.current = true
                lastRemoteCheckRef.current = now

                try {
                    const hasUpdate = await checkRemoteUpdate()
                    if (!hasUpdate) return

                    if (readOnlyRef.current) {
                        const reloaded = await onReloadFromRemote()
                        if (reloaded) {
                            enqueueSnackbar('Page updated.', {
                                autoHideDuration: 3000,
                            })
                        }
                    } else {
                        setReloadConfirmOpen(true)
                    }
                } finally {
                    checkingRemoteUpdateRef.current = false
                }
            }

            document.addEventListener('visibilitychange', handleRefocus)
            window.addEventListener('focus', handleRefocus)

            return () => {
                document.removeEventListener('visibilitychange', handleRefocus)
                window.removeEventListener('focus', handleRefocus)
            }
        }, [
            checkRemoteUpdate,
            enqueueSnackbar,
            fileLoaded,
            onReloadFromRemote,
            reloadConfirmOpen,
        ])

        const confirmRemoteReload = async () => {
            onChangeMarkdown.flush()
            saveChecklistChanges.cancel()
            const reloaded = await onReloadFromRemote()
            if (reloaded) {
                setReadOnly(true)
            }
            setReloadConfirmOpen(false)
        }

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
            patchFileCaches(queryClient, { starred: true }, fileId)
            await updateMetadata(fileId, { starred: true })
        }

        const unstar = async fileId => {
            console.log('unstar page')
            patchFileCaches(queryClient, { starred: false }, fileId)
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
                    key={`${fileId}-${contentReloadKey}`}
                    apiKey={API_KEY}
                    canEdit={canEdit}
                    fileId={fileId}
                    initialValue={editorBody}
                    items={convertFilesToAutocompletItems(initialFiles)}
                    onChangeMarkdown={handleMarkdownChange}
                    pageFileName={fileName}
                    pageWidth={pageWidth}
                    ref={editorRef}
                    readOnly={readOnly}
                    style={{
                        fontSize: '1rem',
                        //! height,
                        padding: "2rem 1.25rem",
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
                <Alert
                    isOpen={reloadConfirmOpen}
                    title="Page updated"
                    onClose={() => setReloadConfirmOpen(false)}
                    onOk={confirmRemoteReload}
                    okLabel="Reload"
                    cancelLabel="Keep editing"
                    maxWidth="sm"
                >
                    This page was updated elsewhere. Reload the latest version?
                    Unsaved changes will be lost.
                </Alert>
            </div>
        )
    }
)
export default EditorLogic
