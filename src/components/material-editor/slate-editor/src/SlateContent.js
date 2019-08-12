import React from 'react'
import classnames from 'classnames'
import { Editor } from 'slate-react'

import { onPaste } from '../../slate-editor-paste-plugin/src'
//
// Nodes
//
import { AlignmentNode } from '../../slate-editor-alignment-plugin/src'
import { EmbedNode } from '../../slate-editor-embed-plugin/src'
import {
    GridNode,
    GridRowNode,
    GridCellNode,
} from '../../slate-editor-grid-plugin/src'
import { ImageNode, ImageLinkNode } from '../../slate-editor-image-plugin/src'
import { LinkNode } from '../../slate-editor-link-plugin/src'
import {
    ListItemNode,
    OrderedListNode,
    UnorderedListNode,
} from '../../slate-editor-list-plugin/src'

//
// Marks
//
import { BoldMark } from '../../slate-editor-bold-plugin/src'
import { ColorMark } from '../../slate-editor-color-plugin/src'
import { FontFamilyMark } from '../../slate-editor-font-family-plugin/src'
import { FontSizeMark } from '../../slate-editor-font-size-plugin/src'
import { ItalicMark } from '../../slate-editor-italic-plugin/src'
import { StrikethroughMark } from '../../slate-editor-strikethrough-plugin/src'
import { UnderlineMark } from '../../slate-editor-underline-plugin/src'

import './SlateContent.css'
import {
    H1Node,
    H2Node,
    H3Node,
    H4Node,
    H5Node,
    H6Node,
} from '../../slate-editor-header-plugin/src'
import { onImageDrop } from '../../slate-editor-image-dnd-plugin/src'

/* eslint-disable default-case */
export const renderNode = props => {
    switch (props.node.type) {
        case 'alignment':
            return <AlignmentNode {...props} />
        case 'embed':
            return <EmbedNode {...props} />
        case 'grid':
            return <GridNode {...props} />
        case 'grid-row':
            return <GridRowNode {...props} />
        case 'grid-cell':
            return <GridCellNode {...props} />
        case 'heading-one':
            return <H1Node {...props} />
        case 'heading-two':
            return <H2Node {...props} />
        case 'heading-three':
            return <H3Node {...props} />
        case 'heading-four':
            return <H4Node {...props} />
        case 'heading-five':
            return <H5Node {...props} />
        case 'heading-six':
            return <H6Node {...props} />
        case 'image':
            return <ImageNode {...props} />
        case 'imageLink':
            return <ImageLinkNode {...props} />
        case 'link':
            return <LinkNode {...props} />
        case 'list-item':
            return <ListItemNode {...props} />
        case 'ordered-list':
            return <OrderedListNode {...props} />
        case 'unordered-list':
            return <UnorderedListNode {...props} />
    }
}

export const renderMark = props => {
    switch (props.mark.type) {
        case 'bold':
            return <BoldMark {...props} />
        case 'color':
            return <ColorMark {...props} />
        case 'font-family':
            return <FontFamilyMark {...props} />
        case 'font-size':
            return <FontSizeMark {...props} />
        case 'italic':
            return <ItalicMark {...props} />
        case 'strikethrough':
            return <StrikethroughMark {...props} />
        case 'underline':
            return <UnderlineMark {...props} />
    }
}
/* eslint-disable default-case */

export default ({
    className,
    wrapperStyle,
    style,
    value,
    outerState,
    plugins,
    onChange,
    children,
    ...rest
}) => {
    const { readOnly } = outerState
    const editorRef = React.createRef()
    window.editorRef = editorRef

    return (
        <div
            className={classnames('editor--content', className)}
            style={wrapperStyle}
        >
            <Editor
                plugins={plugins}
                value={value}
                onChange={onChange}
                onDrop={onImageDrop}
                onPaste={onPaste}
                readOnly={readOnly}
                outerState={outerState}
                style={style}
                ref={editorRef}
                renderNode={renderNode}
                renderMark={renderMark}
                {...rest}
            />
            {children}
        </div>
    )
}
