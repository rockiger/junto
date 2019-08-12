import React, { Component } from 'react'
import classnames from 'classnames'

//import ImageDataModal from './ImageDataModal'
//import ImageEditLayer from './ImageEditLayer'

// FIXME: Needs to handle assets files to work with SSR
//if (require('exenv').canUseDOM) require('./ImageNode.css')

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
        console.log('ImageNode:', this.props)
        const { isModalActive } = this.state
        const {
            node,
            attributes,
            readOnly,
            isSelected,
            editor: {
                onChange,
                props: { value },
            },
        } = this.props
        console.log('node.data.get(src):', node.data.get('src'))

        return (
            <span>
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
                    />
                </div>
            </span>
        )
    }
}

export default ImageNode
