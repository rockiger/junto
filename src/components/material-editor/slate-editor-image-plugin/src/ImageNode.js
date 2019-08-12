import React, { Component } from 'react'
import classnames from 'classnames'

// FIXME: Needs to handle assets files to work with SSR
if (require('exenv').canUseDOM) require('./ImageNode.css')

class ImageNode extends Component {
    constructor(props) {
        super(props)
        this.state = { isModalActive: false }
    }

    modal(isModalActive) {
        if (isModalActive) {
            const {
                editor: {
                    onChange,
                    props: { value },
                },
            } = this.props
            onChange(value.change().select())
        }

        this.setState({ isModalActive })
    }

    render() {
        const { node, attributes, readOnly, isSelected } = this.props
        console.log(this.props)
        return (
            <div
                className={classnames('image-node--container', {
                    readonly: readOnly,
                })}
            >
                {this.props.children}
                <img
                    {...attributes}
                    role="presentation"
                    className={`image-node ${!readOnly &&
                        isSelected &&
                        'selected'}`}
                    src={node.data.get('src')}
                    title={node.data.get('title')}
                    alt={node.data.get('title')}
                    style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '20em',
                        boxShadow:
                            isSelected && !readOnly
                                ? '0 0 0 1px #4285f4'
                                : 'none',
                    }}
                />
            </div>
        )
    }
}

export default ImageNode
