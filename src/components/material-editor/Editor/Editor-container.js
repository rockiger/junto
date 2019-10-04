import React, { useState, useRef } from 'react'
import propTypes from 'prop-types'
import { Block, Value } from 'slate'
import DeepTable from 'slate-deep-table'

import { EditorComponent } from './Editor-component'
import { onPaste } from './htmlSerializer'
import { markdownShortcuts } from './markdownShortcuts'
import { blockPlugins, renderBlock } from '../Block'
import { linkPlugin } from '../Link'
import { markPlugins, renderMark } from '../Mark'
import { imagePlugin } from '../Image'
import { renderDecoration, decorateNode, codeBlockPlugin } from '../Code'
import { drivePlugin } from '../Drive'

export let showModal

// Needs to be outsitde of Editor component, otherwise it get rerenderd all the time
const plugins = [
    ...markPlugins,
    ...blockPlugins,
    codeBlockPlugin,
    linkPlugin,
    imagePlugin,
    drivePlugin,
    DeepTable(),
    markdownShortcuts,
]

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
    document: {
        last: { type: 'paragraph' },
        normalize: (editor, { code, node, child }) => {
            switch (code) {
                case 'last_child_type_invalid': {
                    const paragraph = Block.create('paragraph')
                    return editor.insertNodeByKey(
                        node.key,
                        node.nodes.size,
                        paragraph
                    )
                }
                default:
            }
        },
    },
    blocks: {
        image: {
            isVoid: true,
        },
    },
}

const Editor = React.forwardRef(
    (
        { children, initialValue, items, onChangeHandler, apiKey, readOnly },
        editorRef
    ) => {
        const [value, setValue] = useState(initialValue)
        //const [showModal, setShowModal] = useState(false)
        /**
         * Store a reference to the `editor`.
         *
         * @param {Editor} editor
         */
        // const editorRef = useRef(null)
        const modalRef = useRef(null)

        showModal = async (linkText = '', href = '') => {
            const modal = modalRef.current
            const editor = editorRef.current
            try {
                // Wait user to confirm !
                const result = await modal.show(linkText, href)
                // this line below is executed only after user click on OK
                editor.focus()
                return result
            } catch (err) {
                console.log(err)
                editor.focus()
                return null
            }
        }

        // On change, update the app's React state with the new editor value.
        const onChange = change => onChangeHandler(change, setValue, value)

        return (
            <EditorComponent
                apiKey={apiKey}
                decorateNode={decorateNode}
                items={items}
                plugins={plugins}
                value={value}
                onChange={onChange}
                onPaste={onPaste}
                editorRef={editorRef}
                readOnly={readOnly}
                renderBlock={renderBlock}
                renderDecoration={renderDecoration}
                renderMark={renderMark}
                schema={schema}
                showModal={showModal}
                modalRef={modalRef}
            />
        )
    }
)
export default Editor

Editor.propTypes = {
    initialValue: propTypes.object,
    items: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.string.isRequired,
            icon: propTypes.node,
            href: propTypes.string.isRequired,
            name: propTypes.string.isRequired,
        })
    ),
    onChangeHandler: propTypes.func,
    renderBlock: propTypes.func,
    renderMark: propTypes.func,
}

Editor.defaultProps = {
    initialValue: Value.fromJSON({
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            text: '',
                        },
                    ],
                },
            ],
        },
    }),
    items: [],
    onChangeHandler: ({ value }, setValue) => {
        setValue(value)
    },
    renderBlock: renderBlock,
    renderMark: renderMark,
}
