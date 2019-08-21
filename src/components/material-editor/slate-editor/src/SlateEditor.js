import { PropTypes } from 'prop-types'
import React, { Component } from 'react'
import { Value } from 'slate'
import classnames from 'classnames'
import { keyboardEvent, react, typeCheck } from '../../slate-editor-utils/src'

import initialEditorState from './initialEditorState'

class SlateEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.migrateStateVersion(
                props.initialState || initialEditorState
            ),
            readOnly: true,
            uid: new Date().getUTCMilliseconds(),
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }
    //
    // Migrate Slate's Value object
    // From v0.25.3
    // To   v0.31.3
    migrateStateVersion(value) {
        let updatedValue = value
        if (value.kind !== 'value') {
            updatedValue = JSON.parse(
                JSON.stringify(value)
                    .replace(/"kind":"state"/g, '"kind":"value"')
                    .replace(/"ranges":\[/g, '"leaves":[')
                    .replace(/"kind":"range"/g, '"kind":"leaf"')
            )
        }
        // Upgrade to v0.32.0
        // https://github.com/ianstormtaylor/slate/blob/master/packages/slate/Changelog.md#0320--january-4-2018
        updatedValue = JSON.parse(
            JSON.stringify(updatedValue).replace(/"kind":/g, '"object":')
        )
        return Value.fromJSON(updatedValue)
    }

    //
    // This function change only the Editor value object
    //
    onChange(change) {
        const value = change.value

        this.setState({ value })

        const { onChange } = this.props
        if (typeCheck.isFunction(onChange)) onChange(value)
    }

    onKeyDown = ev => {
        console.log('ev.key:', ev.key)
        console.log('this.state.readOnly:', this.state.readOnly)
        console.log('keyboardEvent.isMod(ev):', keyboardEvent.isMod(ev))
        if (ev.key === 'e' && this.state.readOnly === true) {
            ev.stopPropagation()
            ev.preventDefault()
            this.setState({ readOnly: false }, () =>
                window.editorRef.current.focus()
            )
        } else if (
            keyboardEvent.isMod(ev) &&
            ev.key === 'Enter' &&
            !this.state.readOnly
        ) {
            ev.stopPropagation()
            ev.preventDefault()
            this.props.save()
            this.setState({ readOnly: true }, () => {
                document.querySelector('.editor--toolbar').click()
            })
        }
    }

    //
    // This function change the SlateEditor state object.
    // It can be change the Editor value object too...
    //
    changeState(state) {
        this.setState(state)
    }

    render() {
        const { children, style, className, plugins } = this.props

        const childProps = {
            plugins,
            value: this.state.value,
            outerState: this.state,
            onChange: this.onChange.bind(this),
            changeState: this.changeState.bind(this),
        }

        return (
            <div
                className={classnames('editor--root', className)}
                style={style}
            >
                {react.cloneElement(children, childProps)}
            </div>
        )
    }
}

SlateEditor.propTypes = {
    initialState: PropTypes.object,
}

export default SlateEditor
