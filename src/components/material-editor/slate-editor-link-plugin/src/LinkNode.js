import React, { Component } from 'react'
import { Tooltip } from '../../slate-editor-components/src'
import { hasLinks, getLink, unlink } from './LinkUtils'
import LinkDataModal from './LinkDataModal'
import LinkTooltip from './LinkTooltip'

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
        const { isModalActive, presetData } = this.state
        const {
            children,
            attributes,
            node,
            readOnly,
            editor: {
                onChange,
                props: { value },
            },
        } = this.props
        console.log(value)
        window.value = this.props
        const { selection } = value
        const focusedOnCurrentNode =
            getLink(value) && node.key === getLink(value).key
        const showTooltip =
            !readOnly && selection.isCollapsed && focusedOnCurrentNode

        return (
            <span>
                {!isModalActive ? null : (
                    <LinkDataModal
                        node={node}
                        value={value}
                        onChange={onChange}
                        changeModalState={this.modal.bind(this)}
                        presetData={presetData}
                    />
                )}

                <span className="link-node-container">
                    {showTooltip && (
                        <LinkTooltip
                            show={showTooltip}
                            href={node.data.get('href')}
                            onClickCopy={() => {
                                copyToClipboard(node.data.get('href'))
                            }}
                            onClickEdit={() => this.modal(true)}
                            onClickRemove={() =>
                                onChange(unlink(value.change()))
                            }
                        />
                    )}
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
                        {children}
                    </a>
                </span>
            </span>
        )
    }
}

export default LinkNode

function copyToClipboard(str) {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
    }
}
