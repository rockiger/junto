/* global gapi */
/* global google */
import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'rich-markdown-editor';
import { Beforeunload } from 'react-beforeunload';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { renameFile, downloadFile, getFileDescription, updateFile } from '../lib/gdrive';

import Spinner from './spinner';

import { API_KEY } from '../lib/constants';

export default class Page extends React.Component {
    
    state = {
            defaultValue: '',
            value: undefined,
            fileId: this.props.match.params.id,
            fileName: 'Untitled page.md',
            pageHead: 'Untitled page',
            fileLoaded: false,
    }

    componentDidMount() {
        this.props.setGoToNewFile(false);
    }

    componentDidUpdate(prevProps) {
        // load editor content when user is signed in and can use drive api
        if (this.props.isSignedIn && !this.state.fileLoaded) {
            this.loadEditorContent();
            gapi.load('picker', {'callback': () => console.log('Picker loaded')})
        }

        // when going from one page to the next, we check if the parmeter in the url changed
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.setGoToNewFile(false);
                this.setState({ 
                    fileId: this.props.match.params.id, 
                    fileLoaded: false 
                    },
                    this.loadEditorContent
            )
        }
    }

    componentWillUnmount() {
        this.save();
    }

    onChange = debounce(
        value => {
            console.log('onChange');
            if (!this.state.value) this.setState({ value: value });
            localStorage.setItem(
                this.state.fileId,
                JSON.stringify({
                    body: value(),
                    date: new Date().toGMTString(),
                }),
            );
        },
        300,
        false,
    );

    onSave = options => {
        this.save();
    };

    onClickSave = () => {
        this.save();
    };

    save = () => {
        if (this.state.value)
            this.updateFileContent(this.state.fileId, this.state.value());
    };

    onBlurInput = ev => {
        if (!this.state.pageHead) return;

        if (this.state.fileName !== (this.state.pageHead + '.md')) {
            this.setState({ fileName: this.state.pageHead });
            renameFile(this.state.fileId, this.state.pageHead + '.md');
        }
    };

    onChangeInput = ev => {
        this.setState({ pageHead: ev.target.value });
    };

    loadEditorContent = async ev => {
        if (this.state.fileId) {
            const fileContent = await downloadFile(this.state.fileId);
            const fileDescription = await getFileDescription(this.state.fileId);
            const pageHead = fileDescription.name.substr(0, fileDescription.name.length - 3);
            window.pageHead = pageHead;
            this.setState({
                defaultValue: fileContent,
                fileLoaded: true,
                fileName: fileDescription.name,
                pageHead,
            });
        } else {
            Router.push('/');
        }
    }

    openPicker = () => {
        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("image/png,image/jpeg,image/jpg");
        var picker = new google.picker.PickerBuilder()
              .addView(google.picker.ViewId.DOCS)
              .setOAuthToken(accessToken)
              .setDeveloperKey(API_KEY)
              .setCallback((data) => console.log('DATA:', data))
              .build();
        picker.setVisible(true);
    }

    updateFileContent = async (fileId, content) => {
        try {
            const response = await updateFile(fileId, content);
            return response.result.id;
        } catch (err) {}
    }

    render() {
        let editor = !this.state.fileLoaded ? null : <Editor
        id="editorArea"
        defaultValue={this.state.defaultValue}
        onChange={this.onChange}
        onSave={this.onSave}
        //readOnly={true}
        onClickLink={(ev) => console.log('onClickLink: ', ev)}
    />
        if (this.props.isSignedIn && this.props.match.params.id) {
            return (
                <div className="page">
                    <div className="editorContainer">
                        {this.state.fileLoaded && (
                            <h1 className="editorHeader">
                                <input className="editorInput"
                                    onBlur={this.onBlurInput}
                                    value={this.state.pageHead !== 'Untitled page' ? this.state.pageHead : ''}
                                    placeholder="Untitled page"
                                    onChange={this.onChangeInput}
                                />
                            </h1>
                        )}
                        {this.state.fileLoaded && (
                            editor
                        )}
                        {!this.state.fileLoaded && <Spinner />}
                    </div>
                    <style>{`
                        .page {
                            display: flex;
                        }

                        .editorContainer {
                            height: calc(100vh - 64px);
                            width: 100%;
                            overflow-y: auto;
                        }
                        .editorHeader {
                            margin-top: 1.9rem;
                        }
                        .editorInput {
                            border: 1px solid transparent;
                            font: unset;
                            font-family: 'Open Sans', -apple-system,
                                BlinkMacSystemFont, Avenir Next, Avenir,
                                Helvetica, sans-serif;
                            font-weight: lighter;
                            padding: 0;
                        }
                        .editorInput:hover {
                            border-color: #dadce0;
                        }
                        #editorArea {
                            padding-bottom: 2rem;
                        }
                        button:hover {
                            background: unset;
                            border: none;
                        }
                        
                    `}</style>
                    <button onClick={this.openPicker}>Open Picker</button>
                    <Beforeunload onBeforeunload={() => this.save()} />
                </div>
            );
        } else if (!this.props.isSignedIn && this.props.isSigningIn)
            return <Spinner />
        else if (!this.props.isSignedIn && !this.props.isSigningIn) {
            return <Redirect to="/" />;
        }
    }
}

Page.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      }),
    setGoToNewFile: PropTypes.func.isRequired,
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
