import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Beforeunload } from 'react-beforeunload';

import { updateFile } from '../lib/gdrive';

export default class Editor extends React.Component {

    onChange = (content, delta, source, editor) => {
        console.log('onEditorChange:', editor.getContents());
        this.props.setEditorDelta(editor.getContents())
    }

    componentWillUnmount() {
        this.save();
    }

    save = async () => {
        try {
            await updateFile(
                this.prop.fileId, 
                JSON.stringify(this.prop.editorDelta)
            );
            console.log('save:', this.props.fileId);
        } catch (err) {
            console.log('save: Couldn\'t save file with id:', this.props.fileId);
        }
    };

    render() {
        return (
            <div>
                <ReactQuill 
                    bounds=".editorContainer"
                    onChange={this.onChange}
                    theme="snow"
                    value={this.props.editorDelta}
                />
                <Beforeunload onBeforeunload={() => this.save()} />
                    <style>{`
                        button:hover {
                            background: unset;
                            border: none;
                        }
                        .ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button {
                            min-width: unset;
                        }
                        .ql-toolbar.ql-snow {
                            -webkit-align-items: center;
                            align-items: center;
                            border: none;
                            display: -webkit-inline-box;
                            display: -webkit-inline-flex;
                            display: inline-flex;
                            height: 51px;
                            margin: 0;
                            padding: 8px 2px;
                            position: fixed;
                            right: 1rem;
                            top: 64px;
                            white-space: nowrap;
                            z-index: 1;
                        }
                        .ql-container.ql-snow {
                            border: none;                            
                        }
                        .ql-editor {
                            border-top: 1px solid var(--border-color);
                            height: calc(100vh - 64px - 50px);
                            overflow-y: auto;
                            padding: 1rem .5rem;
                        }
                        
                    `}</style>
            </div>
        )
    }
}
Editor.propTypes = {
    editorDelta: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
    setEditorDelta: PropTypes.func.isRequired,
}


function modules() {
    return (
        {
            'toolbar': [
                [{ 'font': ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'] }, { 'size': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'super' }, { 'script': 'sub' }],
                [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }, { 'align': [] }],
                ['link', 'image', 'video', 'formula'],
                ['clean']
            ],
        }
    )
}
