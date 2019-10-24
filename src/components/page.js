/* global gapi */
import React from 'reactn'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

import LockOutlineIcon from 'mdi-react/LockOutlineIcon'

import {
    renameFile,
    downloadFile,
    getFileDescription,
    refreshSession,
} from '../lib/gdrive'

import EditorLogic from './editorLogic'

import Spinner from './spinner'

import {
    EXT,
    OVERVIEW_NAME,
    UNTITLEDFILE,
    UNTITLEDNAME,
    MYHOME,
} from '../lib/constants'
import { getTitleFromFileName } from '../lib/helper'

export default class Page extends React.Component {
    state = {
        editorDelta: {},
        fileId: this.props.match.params.id,
        fileName: UNTITLEDFILE,
        pageHead: UNTITLEDNAME,
        fileLoaded: false,
        fileLoading: false,
    }

    componentDidMount() {
        this.setGlobal({ goToNewFile: false })
    }

    componentDidUpdate(prevProps) {
        // load editor content when user is signed in and can use drive api
        if (
            this.props.isSignedIn &&
            !this.state.fileLoaded &&
            !this.state.fileLoading
        ) {
            this.setState({ fileLoading: true }, () => {
                this.loadEditorContent()
                gapi.load('picker', {
                    callback: () => console.log('Picker loaded'),
                })
            })
        }

        // when going from one page to the next, we check if the parmeter in the url changed
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setGlobal({ goToNewFile: false })
            this.setState(
                {
                    fileId: this.props.match.params.id,
                    fileLoaded: false,
                },
                this.loadEditorContent
            )
        }
    }

    loadEditorContent = async ev => {
        if (this.state.fileId) {
            try {
                const fileContent = await downloadFile(this.state.fileId)
                const fileDescription = await getFileDescription(
                    this.state.fileId
                )
                const pageHead = getTitleFromFileName(fileDescription.name)
                console.log('this.loadEditorContent:', JSON.parse(fileContent))
                this.setState({
                    initialContent: fileContent ? fileContent : '',
                    fileLoaded: true,
                    fileLoading: false,
                    fileName: fileDescription.name,
                    pageHead,
                })
            } catch (err) {
                const body = JSON.parse(err.body)
                const { error } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        this.loadEditorContent()
                    } catch (err) {
                        alert(`Couldn't refresh session:`)
                        console.log({ err })
                    }
                } else {
                    alert(`Couldn't load file`)
                    console.log({ error })
                }
            }
        } else {
            Router.push('/')
        }
    }

    setEditorDelta = editorDelta => {
        this.setState({ editorDelta })
    }

    onBlurInput = async ev => {
        if (!this.state.pageHead) return

        if (this.state.fileName !== this.state.pageHead + EXT) {
            this.setState({ fileName: this.state.pageHead })
            await renameFile(this.state.fileId, this.state.pageHead + EXT)
            this.setGlobal({ backgroundUpdate: true })
        }
    }

    onChangeInput = ev => {
        this.setState({ pageHead: ev.target.value })
    }

    render() {
        let editor = (
            <EditorLogic
                fileId={this.state.fileId}
                fileLoaded={this.state.fileLoaded}
                initialValue={this.state.initialContent}
                setEditorDelta={this.setEditorDelta}
            />
        )
        if (
            this.props.isSignedIn &&
            this.props.match.params.id &&
            !this.props.isCreatingNewFile
        ) {
            return (
                <div className="page">
                    <div className="editorContainer">
                        {this.state.fileLoaded && (
                            <h1 className="editorHeader">
                                {this.state.fileName === OVERVIEW_NAME ? (
                                    <div
                                        style={{
                                            color: 'grey',
                                            paddingLeft: '.5rem',
                                        }}
                                    >
                                        {MYHOME}{' '}
                                        <LockOutlineIcon size=".75em" />
                                    </div>
                                ) : (
                                    <input
                                        className="editorInput"
                                        onBlur={this.onBlurInput}
                                        value={
                                            this.state.pageHead !==
                                            'Untitled page'
                                                ? this.state.pageHead
                                                : ''
                                        }
                                        placeholder="Untitled page"
                                        onKeyDown={ev => ev.stopPropagation()}
                                        onChange={this.onChangeInput}
                                    />
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
                            padding: .45rem .5rem .5rem 0;
                        }
                        .editorInput {
                            border: 1px solid transparent;
                            font: unset;
                            font-family: Roboto, "Open Sans", Helvetica, Arial, sans-serif;
                            font-weight: 400;;
                            padding: 0 calc(.5rem - 1px);
                        }
                        .editorInput:hover {
                            border-color: #dadce0;
                        }                        
                    `}</style>
                </div>
            )
        } else if (
            (!this.props.isSignedIn && this.props.isSigningIn) ||
            this.props.isCreatingNewFile
        )
            return <Spinner />
        else if (!this.props.isSignedIn && !this.props.isSigningIn) {
            return <Redirect to="/" />
        }
    }
}

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
