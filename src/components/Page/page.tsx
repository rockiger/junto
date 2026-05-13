// @ts-nocheck
/* global gapi */
import React from 'reactn'
import PropTypes from 'prop-types'
import {
    Navigate,
    useNavigate,
    useParams,
    type NavigateFn,
} from '@tanstack/react-router'

import { Chip } from '@material-ui/core'
import LockOutlineIcon from 'mdi-react/LockOutlineIcon'

import {
    renameFile as renameFileInGdrive,
    downloadFile,
    getFileDescription,
    refreshSession,
    updateMetadata,
} from 'lib/gdrive'

import Editor from 'components/Editor'
import { PageView } from 'components/Tracking'

import Spinner from 'components/gsuite-components/spinner'

import { OVERVIEW_NAME, UNTITLEDFILE, UNTITLEDNAME } from 'lib/constants'
import { getFileNameFromTitle, getTitleFromFile } from 'lib/helper'
import { FlexInput } from 'components/FlexInput'

import { BreadcrumbsBar } from './Breadcrumbs'
import { filesUpdater } from 'lib/helper'
import { getPageById, putPage } from 'lib/localDB'

type PageOuterProps = {
    isSignedIn: boolean
    isSigningIn: boolean
    isCreatingNewFile: boolean
    setGoToNewFile: (v: boolean) => void
}

type PageProps = PageOuterProps & {
    navigate: NavigateFn
    params: { id: string }
}

type PageState = {
    canEdit: boolean
    editorDelta: Record<string, unknown>
    fileId: string
    fileName: string
    pageHead: string
    fileLoaded: boolean
    fileLoading: boolean
    initialContent?: string
}

class Page extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props)
        this.state = {
            canEdit: false,
            editorDelta: {},
            fileId: this.props.params.id,
            fileName: UNTITLEDFILE,
            pageHead: UNTITLEDNAME,
            fileLoaded: false,
            fileLoading: false,
        }
        this.editorRef = React.createRef()
        this.inputRef = React.createRef()
    }

    editorRef: React.RefObject<unknown>
    inputRef: React.RefObject<unknown>

    componentDidMount() {
        this.setGlobal({ goToNewFile: false })
        PageView({ pathname: '/page' })
    }

    componentDidUpdate(prevProps: PageProps, prevState: PageState) {
        if (
            this.props.isSignedIn &&
            !this.state.fileLoaded &&
            !this.state.fileLoading &&
            this.global.files.length > 0
        ) {
            this.setState({ fileLoading: true }, () => {
                this.loadEditorContent()
                gapi.load('picker', {
                    callback: () => console.log('Picker loaded'),
                })
            })

            this.updateViewedByMeDate()
        }

        if (
            prevProps.params.id !== this.props.params.id &&
            this.global.files.length > 0
        ) {
            this.setGlobal({ goToNewFile: false })
            this.setState(
                {
                    fileId: this.props.params.id,
                    fileLoaded: false,
                },
                this.loadEditorContent
            )
        }

        if (prevState.pageHead !== this.state.pageHead) {
            document.title = `${this.state.pageHead} – Fulcrum.wiki`
        }
    }

    async downloadFileContent(fileId: string) {
        try {
            const fileContent = await downloadFile(fileId)
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
                    this.loadEditorContent()
                } catch (e) {
                    alert(`Couldn't refresh session:`)
                    console.log({ err: e })
                }
            } else {
                alert(`Couldn't find file`)
                console.log({ error })
                void this.props.navigate({ to: '/' })
            }
            return undefined
        }
    }

    loadEditorContent = async () => {
        const { fileId } = this.state
        if (fileId) {
            let fileContent
            let fileDescription = this.global.files.find(
                (el: { id: string }) => el.id === fileId
            )

            if (!fileDescription)
                fileDescription = await getFileDescription(this.state.fileId)

            const pageHead = getTitleFromFile(fileDescription)

            const page = await getPageById(fileId)
            console.log(page)
            if (page && page.editedTime >= fileDescription.modifiedTime) {
                console.log(page.editTime)
                fileContent = page.content
            } else {
                console.log('Need to look for file in server')
                fileContent = await this.downloadFileContent(fileId)
                await putPage({
                    id: fileId,
                    content: fileContent,
                    editedTime: fileDescription.modifiedTime,
                    modifiedTime: fileDescription.modifiedTime,
                })
            }
            this.setState({
                canEdit: Boolean(fileDescription.capabilities?.canEdit),
                initialContent: fileContent ? fileContent : '',
                fileLoaded: true,
                fileLoading: false,
                fileName: fileDescription.name,
                pageHead,
            })
        } else {
            void this.props.navigate({ to: '/' })
        }
    }

    setEditorDelta = (editorDelta: Record<string, unknown>) => {
        this.setState({ editorDelta })
    }

    onBlurInput = async () => {
        const { fileId } = this.state
        let { pageHead } = this.state
        if (!pageHead) {
            pageHead = 'Untitled page'
            this.setState({ pageHead })
        }

        const fileName = getFileNameFromTitle(pageHead)
        if (this.state.fileName !== fileName) {
            await this.renameFile(fileId, fileName)
        }
    }

    onChangeInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageHead: ev.target.value })
    }

    onKeyDownInput = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        switch (ev.key) {
            case `ArrowDown`:
            case `Tab`:
                ev.preventDefault()
                ;(
                    this.editorRef.current as {
                        focus?: () => void
                    } | null
                )?.focus?.()
                break

            default:
                break
        }

        ev.stopPropagation()
    }

    renameFile = async (id: string, name: string) => {
        const change = { name }

        this.setState({ fileName: name })
        this.setGlobal(filesUpdater(change, this.global, id))
        await renameFileInGdrive(this.state.fileId, name)
    }

    updateViewedByMeDate = () => {
        const { fileId } = this.state
        const now = new Date().toISOString()

        const change = {
            viewedByMe: true,
            viewedByMeTime: now,
        }

        this.setGlobal(filesUpdater(change, this.global, fileId))

        updateMetadata(fileId, { viewedByMeTime: now })
    }

    render() {
        const editor = (
            <Editor
                canEdit={this.state.canEdit}
                fileId={this.state.fileId}
                fileLoaded={this.state.fileLoaded}
                fileName={this.state.fileName}
                initialValue={this.state.initialContent ?? ''}
                inputRef={
                    this.inputRef as React.RefObject<HTMLInputElement | null>
                }
                ref={this.editorRef}
                setEditorDelta={this.setEditorDelta}
            />
        )
        if (
            this.props.isSignedIn &&
            this.props.params.id &&
            !this.props.isCreatingNewFile
        ) {
            console.log({
                'this.state.fileLoaded': this.state.fileLoaded,
                'this.state.fileName': this.state.fileName,
                'this.state.canEdit': this.state.canEdit,
            })
            return (
                <div className="page">
                    <div className="editorContainer">
                        {this.state.fileLoaded && (
                            <h1 className="editorHeader">
                                {this.state.canEdit &&
                                    (this.state.fileName === OVERVIEW_NAME ? (
                                        <div
                                            style={{
                                                color: 'grey',
                                                paddingLeft: '.5rem',
                                            }}
                                        >
                                            {this.state.pageHead}
                                            <LockOutlineIcon size=".75em" />
                                        </div>
                                    ) : (
                                        <BreadcrumbsBar
                                            fileId={this.state.fileId}
                                        >
                                            <FlexInput
                                                id="editorInput"
                                                onBlur={this.onBlurInput}
                                                value={
                                                    this.state.pageHead !==
                                                    'Untitled page'
                                                        ? this.state.pageHead
                                                        : ''
                                                }
                                                placeholder="Untitled page"
                                                ref={
                                                    this
                                                        .inputRef as React.LegacyRef<HTMLInputElement>
                                                }
                                                onKeyDown={this.onKeyDownInput}
                                                onChange={this.onChangeInput}
                                            />
                                        </BreadcrumbsBar>
                                    ))}
                                {!this.state.canEdit && (
                                    <div
                                        style={{
                                            color: 'grey',
                                            paddingLeft: '.5rem',
                                        }}
                                    >
                                        {this.state.pageHead}
                                        <Chip
                                            id="Readonly-Chip"
                                            color="primary"
                                            label="Readonly"
                                            size="small"
                                            style={{
                                                margin: '0 0 3px 1rem',
                                            }}
                                        />
                                    </div>
                                )}
                            </h1>
                        )}
                        {this.state.fileLoaded && editor}
                        {!this.state.fileLoaded && <Spinner />}
                    </div>
                    <style>{`
                        .page {
                            display: flex;
                        }
                        .editorContainer {
                            height: calc(100vh - 65px);
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
                </div>
            )
        } else if (
            (!this.props.isSignedIn && this.props.isSigningIn) ||
            this.props.isCreatingNewFile
        ) {
            return <Spinner />
        } else if (!this.props.isSignedIn && !this.props.isSigningIn) {
            return <Navigate to="/" replace />
        }
        return null
    }
}

function PageWithRouter(props: PageOuterProps) {
    const navigate = useNavigate()
    const params = useParams({ from: '/page/$id' })
    return <Page {...props} navigate={navigate} params={params} />
}

export default PageWithRouter

Page.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
    navigate: PropTypes.func.isRequired,
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    setGoToNewFile: PropTypes.func.isRequired,
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
    if (fileMeta && fileMeta.permissions) {
        const userPermission = fileMeta.permissions.find(
            el => el.emailAddress === userEmail
        )
        if (userPermission) userRole = userPermission.role as DrivePermRole
    }

    return userRole
}
