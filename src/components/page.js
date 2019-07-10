/* global gapi */

import React from 'react'
import Editor from "rich-markdown-editor";
import { Beforeunload } from 'react-beforeunload';
import { BrowserRouter as Router } from 'react-router-dom';
import { renameFile, downloadFile } from '../lib/gdrive';

const gapi = window.gapi;

export default class Page extends React.Component {

    constructor(props){
        super(props);

        this.props = props;
        this.state = { 
            defaultValue: '',
            value: undefined,
            fileId: props.match.params.id,
            fileName: 'Untitled page',
            pageHead: 'Home'
        }

        console.log('props:', props.match.params.id)
    }

    async componentDidMount() {
        this.loadEditorContent();
    }

    componentWillUnmount() {
        this.save();
       }

    onChange = debounce( (value) => {
        console.log('onChange');
        if (!this.state.value) this.setState({ value: value })
        localStorage.setItem(this.state.fileId, JSON.stringify({ body: value(), date: new Date().toGMTString() }))
    }, 300, false);
    
    onSave = (options) => {
        console.log('onSave:', options)
        this.save();
    }

    onClickSave = () => {
        console.log('onClickSave:', this.state.value());
        this.save();
    }
    
    save = () => {
        if (this.state.value)  this.updateFileContent(this.state.fileId, this.state.value());
    }


    onBlurInput = (ev) => {
        if (this.state.fileName !== this.state.pageHead) {
            this.setState({ fileName: this.state.pageHead})
            renameFile(this.state.fileId, this.state.pageHead + '.md')
        }
    }

    onChangeInput = (ev) => {
        this.setState( {pageHead: ev.target.value});
    }

    async loadEditorContent() {
        if(this.state.fileId) {
            //const fileContent = await this.loadFile(this.state.fileId)
            const fileContent = await downloadFile(this.state.fileId);
            console.log('fileContent:', fileContent);
            this.setState( {defaultValue: fileContent})
        } else {
            Router.push('/');
        }
    }

    render() {

    if (this.props.isSignedIn) {
        return (
            <div className="page">
                <div className="editorContainer">
                    {this.state.defaultValue && this.state.fileName && <h1><input onBlur={this.onBlurInput} value={this.state.pageHead} onChange={this.onChangeInput} /></h1>}
                    {this.state.defaultValue && <Editor 
                        id={ this.state.fileId }
                        defaultValue={ this.state.defaultValue }
                        onChange={ this.onChange }
                        onSave={ this.onSave }
                    />}
                </div>
                <style jsx>{`
                    .page {
                        display: flex;
                    }
                    
                    .editorContainer {
                        height: calc(100vh - 112px);
                        overflow-y: auto;
                        padding: .75rem 0 1.5rem;
                        width: 100%
                    }
                    input {
                        border: 1px solid transparent;
                        font: unset;
                        font-family: 'Open Sans',-apple-system,BlinkMacSystemFont, Avenir Next,Avenir,Helvetica,sans-serif;
                        font-weight: lighter;
                        padding: 0;
                    }
                    input:hover {
                        border-color: #dadce0;
                    }
                `}</style>
                <Beforeunload onBeforeunload={ () => this.save() } />
            </div>
        ) } else {
            return (<div>Please login</div>)
        }
    }

    async getHomeId(folderId) {
        try {
        const result = await window.gapi.client.drive.files.list({
            'q': 'name="Home.md"',
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name, modifiedTime)",
            'parents': [folderId]
        });
        const resultBody = JSON.parse(result.body);
        console.log('getHomeId: ', resultBody)
        if (resultBody.files.length > 0) return resultBody.files[0].id;
        } catch (err) {
        console.log(err);
        }
    }

    async createFile(name, parentId) {
        const fileMetadata = {
        'name' : name,
        'mimeType' : 'text/markdown',
        'parents': [parentId]
        };
        try {
        const response = await window.gapi.client.drive.files.create({
            resource: fileMetadata,
        })
        console.log(response);
        
        return response.result.id;
        } catch (err) {
        console.log(err);
        }
    }

  async updateFileContent(fileId, content) {
    try {
      const response = await window.gapi.client.request({
          path: '/upload/drive/v3/files/' + fileId,
          method: 'PATCH',
          params: {
            uploadType: 'media'
          },
          body: content
        })
  
        console.log(response.result);
        window.alert('update')
        return response.result.id
        
    } catch (err) {
      
    }
  }

  async loadFile(fileId) {
    try {
        console.log('gapi:',gapi)
        const result = await window.gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media',
            fields: '*'
            })
            console.log('loadFile:', result);
            return result.body;
        } catch (err) {
            console.log(err)
        }
    }
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
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
