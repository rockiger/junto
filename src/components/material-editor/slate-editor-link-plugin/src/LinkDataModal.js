import React, { Component } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
} from '@material-ui/core'
import { ModalForm } from '../../slate-editor-components/src'
import { updateLinkStrategy, unlink } from './LinkUtils'
import CloseIcon from 'mdi-react/CloseIcon'
import LinkAutocomplete from './LinkAutocomplete'

const classes = {}

class LinkDataModal extends Component {
    constructor(props) {
        super(props)

        const { node } = this.props

        this.state = {
            imageAttributes: {
                title: node.data.get('title'),
                href: node.data.get('href'),
                text: node.data.get('text') || this.props.presetData.text,
                target: node.data.get('target'),
            },
        }
    }

    hasNodeText(props) {
        return props.node.data.get('text')
    }

    componentWillUpdate(props) {
        const hasDiffText = this.props.presetData.text !== props.presetData.text

        if (!this.hasNodeText(this.props) && hasDiffText) {
            this.setLinkAttribute(
                { target: { name: 'text' } },
                props.presetData.text
            )
        }
    }

    componentWillMount() {
        const hasDiffText =
            this.props.presetData.text !== this.state.imageAttributes.text

        // update the text input value according to text that
        // have modified inline outside of the modal.
        if (this.hasNodeText(this.props) && hasDiffText) {
            this.setLinkAttribute(
                { target: { name: 'text' } },
                this.props.presetData.text
            )
        }
    }

    onCloseModal = () => {
        const { node, value, onChange, changeModalState } = this.props

        if (!node.data.get('href')) onChange(unlink(value.change()))
        changeModalState(false)
    }

    setLinkAttribute(event, value, fn = null) {
        this.setState(
            {
                imageAttributes: {
                    ...this.state.imageAttributes,
                    [event.target.name]: value,
                },
            },
            fn
        )
    }

    isValidHref(href) {
        // allow http://, https:// (secure) and non-protocol (default http://)
        // eslint-disable-next-line
        return /^(https?:\/\/)?[\w]{2,}\.[\w\.]{2,}$/.test(href)
    }

    render() {
        const { node, value, onChange, changeModalState } = this.props

        return (
            <Dialog
                aria-labelledby="form-dialog-title"
                onClose={this.onCloseModal}
                fullWidth={true}
                open={true}
                style={{ margin: 0, padding: '1rem' }}
            >
                <DialogTitle>
                    Insert Link
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={this.onCloseModal}
                        size="small"
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '1rem',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <ModalForm
                    onSubmit={e => {
                        e.preventDefault()

                        const { imageAttributes } = this.state

                        if (!imageAttributes.href) {
                            onChange(unlink(value.change()))
                        } else {
                            onChange(
                                updateLinkStrategy({
                                    change: value.change(),
                                    data: imageAttributes,
                                })
                            )
                        }

                        changeModalState(false)
                    }}
                >
                    <DialogContent>
                        <div>
                            <TextField
                                label="Text"
                                margin="dense"
                                name="text"
                                onClick={e => e.stopPropagation()}
                                onChange={e =>
                                    this.setLinkAttribute(e, e.target.value)
                                }
                                style={{ width: 310 }}
                                value={this.state.imageAttributes.text || ''}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div>
                            <LinkAutocomplete
                                onChange={e =>
                                    this.setLinkAttribute(e, e.target.value)
                                }
                                onSelect={val => {
                                    console.log('onSelect', val)
                                    const e = { target: { name: 'href' } }
                                    this.setLinkAttribute(
                                        e,
                                        '/page/' + val,
                                        () => {
                                            const {
                                                imageAttributes,
                                            } = this.state

                                            if (!imageAttributes.href) {
                                                onChange(unlink(value.change()))
                                            } else {
                                                onChange(
                                                    updateLinkStrategy({
                                                        change: value.change(),
                                                        data: imageAttributes,
                                                    })
                                                )
                                            }

                                            changeModalState(false)
                                        }
                                    )
                                }}
                                value={this.state.imageAttributes.href || ''}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions
                        className={classes.actions}
                        style={{ padding: '.5rem 1rem 1rem' }}
                    >
                        <Button
                            onClick={this.onCloseModal}
                            style={{
                                textTransform: 'capitalize',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            disabled={true ? false : true}
                            style={{ textTransform: 'capitalize' }}
                            type="submit"
                            variant="contained"
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </ModalForm>
            </Dialog>
        )
    }
}

export default LinkDataModal
