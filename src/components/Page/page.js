/* global gapi */
import React from 'reactn'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Redirect, withRouter } from 'react-router-dom'

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

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            canEdit: false,
            editorDelta: {},
            fileId: this.props.match.params.id,
            fileName: UNTITLEDFILE,
            pageHead: UNTITLEDNAME,
            fileLoaded: false,
            fileLoading: false,
        }
        this.editorRef = React.createRef(null)
        this.inputRef = React.createRef(null)
    }
    componentDidMount() {
        this.setGlobal({ goToNewFile: false })
        PageView()
    }

    componentDidUpdate(prevProps, prevState) {
        // load editor content when user is signed in and can use drive api
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

        // when going from one page to the next, we check if the parmeter in the url changed
        if (
            prevProps.match.params.id !== this.props.match.params.id &&
            this.global.files.length > 0
        ) {
            this.setGlobal({ goToNewFile: false })
            this.setState(
                {
                    fileId: this.props.match.params.id,
                    fileLoaded: false,
                },
                this.loadEditorContent
            )
        }

        // Change title if pageHead changed
        if (prevState.pageHead !== this.state.pageHead) {
            document.title = `${this.state.pageHead} – Fulcrum.wiki`
        }
    }

    async downloadFileContent(fileId) {
        try {
            const fileContent = await downloadFile(fileId)
            return fileContent
        } catch (err) {
            console.log({ err })
            const body = err.body ? JSON.parse(err.body) : {}
            const { error = {} } = body
            if (error.message === 'Invalid Credentials') {
                try {
                    await refreshSession()
                    this.loadEditorContent()
                } catch (err) {
                    alert(`Couldn't refresh session:`)
                    console.log({ err })
                }
            } else {
                alert(`Couldn't find file`)
                console.log({ error })
                this.props.history.push('/')
            }
            return undefined
        }
    }

    loadEditorContent = async ev => {
        const { fileId } = this.state
        if (fileId) {
            let fileContent
            let fileDescription = this.global.files.find(el => el.id === fileId)

            if (!fileDescription)
                fileDescription = await getFileDescription(this.state.fileId)

            const pageHead = getTitleFromFile(fileDescription)

            // get local page content from localDB if present and up to date
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
                canEdit: fileDescription.capabilities?.canEdit,
                initialContent: fileContent ? fileContent : '',
                fileLoaded: true,
                fileLoading: false,
                fileName: fileDescription.name,
                pageHead,
            })
        } else {
            Router.push('/')
        }
    }

    setEditorDelta = editorDelta => {
        this.setState({ editorDelta })
    }

    onBlurInput = async ev => {
        const { fileId } = this.state
        let { pageHead } = this.state
        if (!pageHead) {
            pageHead = 'Untitled page'
            this.setState({ pageHead })
        }

        const fileName = getFileNameFromTitle(pageHead)
        if (this.state.fileName !== fileName) {
            this.renameFile(fileId, fileName)
        }
    }

    onChangeInput = ev => {
        this.setState({ pageHead: ev.target.value })
    }

    onKeyDownInput = ev => {
        switch (ev.key) {
            case `ArrowDown`:
            case `Tab`:
                ev.preventDefault()
                this.editorRef.current.focus()
                break

            default:
                break
        }

        ev.stopPropagation()
    }

    /**
     * Renames the file in the global state and in Google Drive
     *
     * @param {string} - the id of the of the file
     * @param {string} - the new name
     */
    renameFile = async (id, name) => {
        const change = { name }

        this.setState({ fileName: name })
        this.setGlobal(filesUpdater(change, this.global, id))
        await renameFileInGdrive(this.state.fileId, name)
    }

    /**
     * Updates the the viewedByMe and viewedByMeTime properties
     * in the global state and in Google Drive
     */
    updateViewedByMeDate = () => {
        const { fileId } = this.state
        const now = new Date().toISOString()

        const change = {
            viewedByMe: true,
            viewedByMeTime: now,
        }

        // Update the global state
        this.setGlobal(filesUpdater(change, this.global, fileId))

        // Update the file on Google Drive
        updateMetadata(fileId, { viewedByMeTime: now })
    }

    render() {
        let editor = (
            <Editor
                canEdit={this.state.canEdit}
                fileId={this.state.fileId}
                fileLoaded={this.state.fileLoaded}
                fileName={this.state.fileName}
                initialValue={this.state.initialContent}
                inputRef={this.inputRef}
                ref={this.editorRef}
                setEditorDelta={this.setEditorDelta}
            />
        )
        if (
            this.props.isSignedIn &&
            this.props.match.params.id &&
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
                                                ref={this.inputRef}
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
            return <Redirect to="/" />
        }
    }
}

export default withRouter(Page)

Page.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }),
    }),
    setGoToNewFile: PropTypes.func.isRequired,
}

/**
 *
 * @param {string} fileId
 * @param {object[]} files
 * @param {string} userEmail
 */
export function getUserRole(fileId, files, userEmail) {
    const fileMeta = files.find(file => file.id === fileId)
    console.log(fileMeta)
    /** @type {'organizer' | 'owner' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader'} */
    let userRole = 'owner'
    if (fileMeta && fileMeta.permissions) {
        const userPermission = fileMeta.permissions.find(
            el => el.emailAddress === userEmail
        )
        if (userPermission) userRole = userPermission.role
    }

    return userRole
}
