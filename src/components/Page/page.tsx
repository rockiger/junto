/* global gapi */


import { Chip } from '@material-ui/core'
import {
    Navigate,
    useNavigate,
    useParams,
    useRouter,
} from '@tanstack/react-router'
import Editor from 'components/Editor'
import { FlexInput } from 'components/FlexInput'
import { BreadcrumbsBar } from 'components/Page/Breadcrumbs'
import IconButton from 'components/gsuite-components/icon-button'
import Spinner from 'components/gsuite-components/spinner'
import { PageView } from 'components/Tracking'
import { OVERVIEW_NAME, UNTITLEDFILE, UNTITLEDNAME } from 'lib/constants'
import {
    downloadFile,
    getFileDescription,
    refreshSession,
    renameFile as renameFileInGdrive,
    updateMetadata,
} from 'lib/gdrive'
import { filesUpdater, getFileNameFromTitle, getTitleFromFile } from 'lib/helper'
import { getPageById, putPage } from 'lib/localDB'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'
import LockOutlineIcon from 'mdi-react/LockOutlineIcon'
import type { ChangeEvent, KeyboardEvent } from 'react'
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { getGlobal, setGlobal, useGlobal } from 'reactn'
import type { IFile } from 'reactn/default'
import { useIsDesktop } from 'lib/hooks/useMediaQuery'

// biome-ignore lint/suspicious/noExplicitAny: `Editor` is a JS `forwardRef` without exported props
const EditorWithFileProps = Editor as any
// biome-ignore lint/suspicious/noExplicitAny: `FlexInput` is a JS `forwardRef` without exported props
const FlexInputField = FlexInput as any

type PageProps = {
    isSignedIn: boolean
    isSigningIn: boolean
    isCreatingNewFile: boolean
    setGoToNewFile: (v: boolean) => void
}

export default function Page({
    isSignedIn,
    isSigningIn,
    isCreatingNewFile,
    setGoToNewFile: _setGoToNewFile,
}: PageProps) {
    const navigate = useNavigate()
    const router = useRouter()
    const params = useParams({ from: '/_app/page/$id' })
    const [initialFiles] = useGlobal('initialFiles')

    const [canEdit, setCanEdit] = useState(false)
    const [, setEditorDeltaState] = useState<Record<string, unknown>>({})
    const [fileId, setFileId] = useState(() => params.id)
    const [fileName, setFileName] = useState(UNTITLEDFILE)
    const [pageHead, setPageHead] = useState(UNTITLEDNAME)
    const [fileLoaded, setFileLoaded] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const [initialContent, setInitialContent] = useState<string | undefined>(
        undefined
    )

    const editorRef = useRef<{ focus?: () => void } | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const prevParamsIdRef = useRef<string | null>(null)

    const isMobile = !useIsDesktop()

    const onBack = () => {
        if (router.history.canGoBack()) {
            router.history.back()
        } else {
            void navigate({ to: '/home' })
        }
    }

    const setEditorDelta = useCallback(
        (delta: Record<string, unknown>) => {
            setEditorDeltaState(delta)
        },
        []
    )

    const loadEditorContentRef = useRef<
        (explicitFileId?: string) => Promise<void>
    >(async () => { })

    const downloadFileContent = useCallback(
        async (driveFileId: string) => {
            try {
                const fileContent = await downloadFile(driveFileId)
                return fileContent
            } catch (err: unknown) {
                console.log({ err })
                const rawBody =
                    err &&
                        typeof err === 'object' &&
                        'body' in err &&
                        typeof (err as { body: string }).body === 'string'
                        ? (err as { body: string }).body
                        : '{}'
                const body = JSON.parse(rawBody) as {
                    error?: { message?: string }
                }
                const { error = {} } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        void loadEditorContentRef.current()
                    } catch (e) {
                        alert(`Couldn't refresh session:`)
                        console.log({ err: e })
                    }
                } else {
                    alert(`Couldn't find file`)
                    console.log({ error })
                    void navigate({ to: '/home' })
                }
                return undefined
            }
        },
        [navigate]
    )

    const loadEditorContent = useCallback(
        async (explicitFileId?: string) => {
            const id = explicitFileId ?? fileId
            if (!id) {
                void navigate({ to: '/home' })
                return
            }

            let fileContent: string | undefined
            let fileDescription: IFile | undefined = initialFiles.find(
                (el: IFile) => el.id === id
            )

            if (!fileDescription) {
                fileDescription = (await getFileDescription(
                    id
                )) as IFile
            }

            if (!fileDescription) {
                void navigate({ to: '/home' })
                return
            }

            const nextPageHead = getTitleFromFile(fileDescription)

            const page = await getPageById(id)
            console.log(page)
            const remoteModified = fileDescription.modifiedTime ?? ''
            if (page && page.editedTime >= remoteModified) {
                console.log(page.editedTime)
                fileContent = page.content
            } else {
                console.log('Need to look for file in server')
                fileContent = await downloadFileContent(id)
                const contentToStore = fileContent ?? ''
                await putPage({
                    id,
                    content: contentToStore,
                    editedTime: remoteModified,
                    modifiedTime: remoteModified,
                })
            }
            setCanEdit(Boolean(fileDescription.capabilities?.canEdit))
            setInitialContent(fileContent ? fileContent : '')
            setFileLoaded(true)
            setFileLoading(false)
            setFileName(fileDescription.name)
            setPageHead(nextPageHead)
        },
        [downloadFileContent, fileId, initialFiles, navigate]
    )

    loadEditorContentRef.current = loadEditorContent

    useEffect(() => {
        setGlobal({ goToNewFile: false })
        PageView({ pathname: '/page' })
    }, [])

    useEffect(() => {
        document.title = `${pageHead} – Fulcrum.wiki`
    }, [pageHead])

    useEffect(() => {
        if (initialFiles.length === 0) return

        if (prevParamsIdRef.current === null) {
            prevParamsIdRef.current = params.id
            return
        }

        if (prevParamsIdRef.current === params.id) return

        prevParamsIdRef.current = params.id
        setGlobal({ goToNewFile: false })
        setFileId(params.id)
        setFileLoaded(false)
        void loadEditorContent(params.id)
    }, [params.id, initialFiles.length, loadEditorContent])

    useEffect(() => {
        if (
            !isSignedIn ||
            fileLoaded ||
            fileLoading ||
            initialFiles.length === 0
        ) {
            return
        }

        setFileLoading(true)
        void loadEditorContent()
        gapi.load('picker', () => {
            console.log('Picker loaded')
        })

        const now = new Date().toISOString()
        const change = {
            viewedByMe: true,
            viewedByMeTime: now,
        }
        setGlobal(filesUpdater(change, getGlobal(), fileId))
        updateMetadata(fileId, { viewedByMeTime: now })
    }, [
        isSignedIn,
        fileLoaded,
        fileLoading,
        initialFiles.length,
        loadEditorContent,
        fileId,
    ])

    const onBlurInput = async () => {
        let nextHead = pageHead
        if (!nextHead) {
            nextHead = 'Untitled page'
            setPageHead(nextHead)
        }

        const nextFileName = getFileNameFromTitle(nextHead)
        if (fileName !== nextFileName) {
            await renameFile(fileId, nextFileName)
        }
    }

    const onChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
        setPageHead(ev.target.value)
    }

    const onKeyDownInput = (ev: KeyboardEvent<HTMLInputElement>) => {
        switch (ev.key) {
            case `ArrowDown`:
            case `Tab`:
                ev.preventDefault()
                editorRef.current?.focus?.()
                break

            default:
                break
        }

        ev.stopPropagation()
    }

    const renameFile = async (id: string, name: string) => {
        const change = { name }

        setFileName(name)
        setGlobal(filesUpdater(change, getGlobal(), id))
        await renameFileInGdrive(fileId, name)
    }

    const editor = (
        <EditorWithFileProps
            canEdit={canEdit}
            fileId={fileId}
            fileLoaded={fileLoaded}
            fileName={fileName}
            initialValue={initialContent ?? ''}
            inputRef={inputRef}
            ref={editorRef}
            setEditorDelta={setEditorDelta}
        />
    )

    if (
        isSignedIn &&
        params.id &&
        !isCreatingNewFile
    ) {
        console.log({
            'this.state.fileLoaded': fileLoaded,
            'this.state.fileName': fileName,
            'this.state.canEdit': canEdit,
        })
        return (
            <>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-edge-strong bg-surface-container px-2 md:px-3 lg:bg-white lg:sticky lg:top-0 lg:z-10">
                    <IconButton className='lg:hidden!' ariaLabel="Back" onClick={onBack}>
                        <ArrowLeftIcon aria-hidden />
                    </IconButton>
                    {fileLoaded && (
                        <h1 className="flex items-center text-2xl font-semibold overflow-clip text-ellipsis max-w-[calc(100vw-200px)]">
                            {canEdit &&
                                (fileName === OVERVIEW_NAME ? (
                                    <div className='flex items-baseline text-text-muted'
                                    >
                                        {pageHead}
                                        <LockOutlineIcon size=".75em" />
                                    </div>
                                ) : (
                                    isMobile ? (
                                        <FlexInputField
                                            id="editorInput"
                                            className="translate-y-0.5"
                                            onBlur={onBlurInput}
                                            value={pageHead !== 'Untitled page'
                                                ? pageHead
                                                : ''}
                                            placeholder="Untitled page"
                                            ref={inputRef}
                                            onKeyDown={onKeyDownInput}
                                            onChange={onChangeInput} />
                                    ) : (
                                        <BreadcrumbsBar fileId={fileId}>
                                            <FlexInputField
                                                id="editorInput"
                                                className="border border-transparent translate-y-0.5 text-xl text-text-muted hover:border-edge-strong"
                                                onBlur={onBlurInput}
                                                value={pageHead !== 'Untitled page'
                                                    ? pageHead
                                                    : ''}
                                                placeholder="Untitled page"
                                                ref={inputRef}
                                                onKeyDown={onKeyDownInput}
                                                onChange={onChangeInput} />
                                        </BreadcrumbsBar>
                                    )))}
                            {!canEdit && (
                                <div
                                    style={{
                                        color: 'grey',
                                        paddingLeft: '.5rem',
                                    }}
                                >
                                    {pageHead}
                                    <Chip
                                        id="Readonly-Chip"
                                        color="primary"
                                        label="Readonly"
                                        size="small"
                                        style={{
                                            margin: '0 0 3px 1rem',
                                        }} />
                                </div>
                            )}
                        </h1>
                    )}
                </header>
                <div className="page bg-white flex min-h-0 min-w-0 flex-1 flex-col">
                    <div className="editorContainer max-w-full prose prose-stone">
                        {fileLoaded && editor}
                        {!fileLoaded && <Spinner />}
                    </div>
                    <style>{`
                        .page {
                            display: flex;
                            flex-direction: column;
                            flex: 1;
                            min-height: 0;
                            min-width: 0;
                        }
                        .editorContainer {
                            flex: 1;
                            min-height: 0;
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                        }
                        .editorHeader {
                            border-bottom: 1px solid #d5d5d5;
                            font-size: 1.5rem;
                            font-weight: 400;
                            margin: 0;
                            padding: 0 0.5rem;
                        }                       
                    `}</style>
                </div></>
        )
    } else if (
        (!isSignedIn && isSigningIn) ||
        isCreatingNewFile
    ) {
        return <Spinner />
    } else if (!isSignedIn && !isSigningIn) {
        return <Navigate to="/" replace />
    }
    return null
}

type DrivePermRole =
    | 'organizer'
    | 'owner'
    | 'fileOrganizer'
    | 'writer'
    | 'commenter'
    | 'reader'

export function getUserRole(
    fileId: string,
    files: {
        id: string
        permissions?: { emailAddress?: string; role: string }[]
    }[],
    userEmail: string
): DrivePermRole {
    const fileMeta = files.find(file => file.id === fileId)
    console.log(fileMeta)
    let userRole: DrivePermRole = 'owner'
    if (fileMeta?.permissions) {
        const userPermission = fileMeta.permissions.find(
            el => el.emailAddress === userEmail
        )
        if (userPermission) userRole = userPermission.role as DrivePermRole
    }

    return userRole
}
