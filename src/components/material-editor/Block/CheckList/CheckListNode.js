import React from 'react'

export class CheckListItem extends React.Component {
    /**
     * On change, set the new checked value on the block.
     *
     * @param {Event} event
     */

    onChange = event => {
        const checked = event.target.checked
        const { editor, node } = this.props
        editor.setNodeByKey(node.key, { data: { checked } })
    }

    /**
     * Render a check list item, using `contenteditable="false"` to embed the
     * checkbox right next to the block's text.
     *
     * @return {Element}
     */

    render() {
        const { attributes, children, node, readOnly } = this.props
        const checked = node.data.get('checked')
        return (
            <div
                {...attributes}
                className={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <span
                    contentEditable={false}
                    className={{
                        marginRight: '0.75em',
                    }}
                >
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={this.onChange}
                    />
                </span>
                <span
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    className={{
                        flex: 1,
                        opacity: checked ? 0.666 : 1,
                        textDecoration: checked ? 'none' : 'line-through',
                        // &:focus {
                        //     outline: none,
                        // }
                    }}
                >
                    {children}
                </span>
            </div>
        )
    }
}
