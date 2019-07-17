import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Beforeunload } from 'react-beforeunload';

import EditorToolbar from './editorToolbar'
import { updateFile } from '../lib/gdrive';

export default class Editor extends React.Component {

    state = {
        editorDelta: this.props.editorDelta,
    }

    onChange = (content, delta, source, editor) => {
        console.log('onEditorChange:', editor.getContents());
        this.setState({editorDelta: editor.getContents()})
    }

    componentWillUnmount() {
        this.save();
    }

    save = async () => {
        try {
            await updateFile(
                this.props.fileId, 
                JSON.stringify(this.state.editorDelta)
            );
            console.log('save:', this.props.fileId);
        } catch (err) {
            console.log('save: Couldn\'t save file with id:', this.props.fileId);
            console.log('Error:', err)
        }
    };

    render() {
        return (
            <div>
                <EditorToolbar />
                <ReactQuill 
                    bounds=".editorContainer"
                    modules={Editor.modules}
                    formats={Editor.format}
                    onChange={this.onChange}
                    readOnly={false}
                    theme="snow"
                    value={this.state.editorDelta}
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

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        link: linkHandler,
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };
  
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color"
  ];

  /*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */

  function linkHandler(value) {
    console.log("HANDLER", this)
    const quill = this.quill;
    const theme = quill.theme;
    const bounds = quill.getBounds( quill.getSelection())
    const tooltip = document.querySelector('.ql-tooltip')
    console.log(bounds)
    bounds.left = bounds.left - 240;

    console.log(tooltip)
    window.tooltip = tooltip
    
    theme.tooltip.position( bounds )
    theme.tooltip.show()
    tooltip.classList.add('ql-editing')
    // add ql-editing to show input field

 /*  if (value) {
    var href = prompt('Enter the URL');
    this.quill.format('link', href);
  } else {
    this.quill.format('link', false);
  } */
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
