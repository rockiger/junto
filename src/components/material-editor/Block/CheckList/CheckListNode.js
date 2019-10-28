import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'

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
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <span contentEditable={false}>
                    <Checkbox
                        type="checkbox"
                        checked={checked}
                        onChange={this.onChange}
                    />
                </span>
                <span
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    style={{
                        flex: 1,
                        opacity: checked ? 0.666 : 1,
                        textDecoration: checked ? 'line-through' : 'none',
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
