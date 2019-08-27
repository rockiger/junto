import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box'

import Logo from '../../../logo'

// FIXME: Needs to handle assets files to work with SSR
if (require('exenv').canUseDOM) require('./LinkNode.css')

class LinkNode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalActive: false,
            mounted: false,
            presetData: { text: '' },
        }
    }

    modal(isModalActive) {
        this.setState({ isModalActive })
    }

    componentDidMount() {
        const { node } = this.props

        if (node.data.get('openModal')) this.modal(true)

        this.setState({
            presetData: { text: this.text.innerText },
            mounted: true,
        })
    }

    componentWillUpdate(props, state) {
        if (state.mounted && state.presetData.text !== this.text.innerText) {
            this.setState({
                presetData: { text: this.text.innerText },
            })
        }
    }

    render() {
        const {
            children,
            attributes,
            node,
            // readOnly,
        } = this.props
        console.log(node.data)
        return (
            <Box
                borderRadius={3}
                boxShadow={1}
                className="drive-link-node-container"
                component="span"
                style={{ padding: '0 .25rem 2px' }}
            >
                {node.data.get('internal') ? (
                    <Link
                        to={`/page/${node.data.get('id')}`}
                        {...attributes}
                        className="link-node"
                        title={node.data.get('title')}
                        ref={text => {
                            this.text = text
                        }}
                    >
                        <Logo
                            style={{
                                height: 16,
                                marginBottom: -3,
                                marginRight: '.25rem',
                                width: 16,
                            }}
                        />
                        {children}
                    </Link>
                ) : (
                    <>
                        <a
                            {...attributes}
                            className="link-node"
                            href={node.data.get('href')}
                            target={node.data.get('target')}
                            title={node.data.get('title')}
                            ref={text => {
                                this.text = text
                            }}
                        >
                            <img
                                alt=""
                                src={node.data.get('iconUrl')}
                                style={{
                                    marginBottom: -3,
                                    marginRight: '.25rem',
                                }}
                            />
                            {children}
                        </a>
                    </>
                )}
                {/* Function is to sketchy right now. User can remove by hand
                        !readOnly && (
                            <CloseIcon
                                onClick={() =>
                                    onChange(
                                        removeNodeByKey(
                                            node.key,
                                            value.change()
                                        )
                                    )
                                }
                                size={12}
                                style={{
                                    marginBottom: -1,
                                    marginLeft: 2,
                                    cursor: 'pointer',
                                }}
                            />
                            ) */}
            </Box>
        )
    }
}

export default LinkNode
