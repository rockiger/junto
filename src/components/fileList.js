import React from 'reactn'

import FileListRenderer from './fileListRenderer'

export default class FileList extends React.Component {
    render() {
        const { files, isFileListLoading, searchTerm } = this.global
        return <FileListRenderer isLoading={isFileListLoading} files={files} />
    }
}

function defaultMessage() {
    return '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"My first ","marks":[]},{"object":"inline","type":"link","data":{"href":"http://rockiger.com"},"nodes":[{"object":"text","text":"paragraph","marks":[]}]},{"object":"text","text":"!","marks":[]}]}]}}'
}
