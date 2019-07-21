import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Beforeunload } from 'react-beforeunload';
import ReactModal from 'react-modal';
import Autocomplete from 'react-autocomplete';

import EditorToolbar from './editorToolbar'
import { getFolderId, listFiles, updateFile } from '../lib/gdrive';
import { getExtFromFilenName, getTitleFromFileName } from '../lib/helper';
import { EXT } from '../lib/constants';

// To bring contextt together
let __editor__;
let __toolbar__;

export default class Editor extends React.Component {

    constructor(props) {
        super(props)
        ReactModal.setAppElement('#root');
        this.state = {
            editorDelta: this.props.editorDelta,
            isModalOpen: false,
            autocompleteValue: '',
            autocompleteItems: [],
            editor: null,
        }

        this.autocomplete = React.createRef();
        __editor__ = this;
    }


    componentWillUnmount() {
        this.save();
    }


    listFiles = async () => {
        const folderId = await getFolderId();
        if (folderId) {
            const files = await listFiles();
            const autocompleteItems = files.filter(file => {
                const ext = getExtFromFilenName(file.name);                
                return (ext === EXT)
            })

            this.setState({ autocompleteItems });
        }
    }

    onChange = (content, delta, source, editor) => {
        console.log('onEditorChange:', editor);
        this.setState({editorDelta: editor.getContents()})
    }

    onClickSelectButton = () => {
        console.log('onClickSelecButton:', this.state.autocompleteValue)
        __toolbar__.quill.format('link', this.state.autocompleteValue)
        this.setState({ isModalOpen: false, autocompleteValue: '' })
    }
    
    onCloseModal = () => {
        this.setState({ isModalOpen: false })
    }

    onKeyDownInput = (e) => {
        if(e.keyCode === 13){
            console.log('value', e.target.value);
            this.onClickSelectButton();
         }
    }

    onSelectAutocomplete = (val) => {
        __toolbar__.quill.format('link', '/page/' + val);
        this.setState({ isModalOpen: false, autocompleteValue:  '' });
    }

    openLinkDiaglog = () => {
        this.setState({ isModalOpen: true })
        this.listFiles();
        this.autocomplete.current.focus()
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
                    modules={this.modules}
                    formats={Editor.format}
                    onChange={this.onChange}
                    readOnly={false}
                    theme="snow"
                    value={this.state.editorDelta}
                />
                <Beforeunload onBeforeunload={() => this.save()} />
                <ReactModal 
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.onCloseModal}
                    style={{
                        overlay: {
                            zIndex: 1000,
                        },
                        content: {
                            bottom: 0,
                            height: '300px',
                            left: 0,
                            margin: 'auto',
                            maxHeight: '80vh',
                            maxWidth: '80vw',
                            position: 'relative',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '500px',

                        }
                    }}
                >
                    <div onClick={this.onCloseModal}
                        style={{
                            background: 'no-repeat url(//ssl.gstatic.com/docs/picker/images/onepick_sprite12.svg) 0 -146px',
                            height: 20,
                            width: 20,
                            position: 'absolute',
                            right: 20,
                        }}
                    />
                    <h2 style={{ fontWeight: 400, marginTop: 0, }}>Insert Link</h2>
                    <Autocomplete
                        ref={ this.autocomplete }
                        items={this.state.autocompleteItems}
                        shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                        getItemValue={item => item.id}
                        renderItem={(item, highlighted) =>
                        <div
                            key={item.id}
                            style={{ 
                                backgroundColor: highlighted ? '#eee' : 'transparent',
                                color: 'var(--link-color)',
                                display: 'block',
                                padding: '.5rem .25rem',
                                cursor: 'pointer',
                            }}
                        >
                            <img style={{ paddingRight: '.25rem', verticalAlign: 'middle' }} src="https://drive-thirdparty.googleusercontent.com/16/type/application/json" alt="Wiki File" />
                            <span style={{ verticalAlign: 'middle' }}>{getTitleFromFileName(item.name)}</span>
                        </div>
                        }
                        value={this.state.autocompleteValue}
                        onChange={(e) => this.setState({ autocompleteValue: e.target.value })}
                        onSelect={ this.onSelectAutocomplete }
                        inputProps={{ 
                            style: {
                                borderColor: 'rgb(192, 192, 192) rgb(217, 217, 217) rgb(217, 217, 217)',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                height: '1.25rem',
                                paddingLeft: '.25rem',
                                width: 300,
                            },
                            onKeyDown: this.onKeyDownInput,
                        }}
                        menuStyle={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '3px',
                            border: '1px solid #e5e5e5',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            padding: '2px 0',
                            fontSize: '90%',
                            position: 'static',
                            overflow: 'auto',
                            maxHeight: '50%',
                            minWidth: 'unset',
                        }}
                    />

                    <div className="button-bar"
                        style={{ 
                            borderTop: '1px solid rgb(229, 229, 229)',
                            boxSizing: 'border-box',
                            left: 0,
                            padding: 20,
                            width: '100%',
                         }}
                    >
                        <button className="action" onClick={ this.onClickSelectButton }>Select</button> <button onClick={this.onCloseModal}>Cancel</button>
                    </div>

                </ReactModal>
                    <style>{`
                        .ql-toolbar button:hover {
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

    modules = {
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
    function linkHandler (value)  {
        console.log("HANDLER", value)
        if (value) {
            __editor__.openLinkDiaglog();
            __toolbar__ = this;
        } else {
            this.quill.format('link', false);
        }
    /* const quill = this.quill;
    const theme = quill.theme;
    const bounds = quill.getBounds( quill.getSelection())
    const tooltip = document.querySelector('.ql-tooltip')
    console.log(bounds)
    bounds.left = bounds.left - 240;

    console.log(tooltip)
    window.tooltip = tooltip */

    
    /* theme.tooltip.position( bounds )
    theme.tooltip.show()
    tooltip.classList.add('ql-editing') */
    // add ql-editing to show input field

 /*  if (value) {
    var href = prompt('Enter the URL');
    this.quill.format('link', href);
  } else {
  } */
}
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