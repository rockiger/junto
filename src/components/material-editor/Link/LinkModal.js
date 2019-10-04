import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
} from '@material-ui/core'
import CloseIcon from 'mdi-react/CloseIcon'

import LinkAutocomplete from './LinkAutocomplete'

const classes = {}

export class LinkModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            text: '',
            href: '',
        }
        this.promiseInfo = {}
    }

    show = async (text = '', href = '') => {
        return new Promise((resolve, reject) => {
            this.promiseInfo = {
                resolve,
                reject,
            }
            console.log(text)
            this.setState({ href, text, show: true })
        })
    }

    hide = () => {
        this.setState({
            show: false,
        })
    }

    onCancel = () => {
        this.hide()
        this.setState({ href: '', text: '' })
        this.promiseInfo.reject()
    }

    onSelect = val => {
        console.log('onSelect', val)
        const item = this.props.items.find(el => el.id === val)
        console.log('item', item)
        this.hide()
        this.setState({ href: '', text: '' })
        this.promiseInfo.resolve({
            href: item.href,
            text: item.name,
        })
    }

    onSubmit = ev => {
        ev.preventDefault()
        this.hide()
        this.setState({ href: '', text: '' })
        this.promiseInfo.resolve({
            href: this.state.href,
            text: this.state.text,
        })
    }

    render() {
        const { show, text } = this.state
        return !show ? null : (
            <Dialog
                aria-labelledby="form-dialog-title"
                onClose={onCloseModal}
                fullWidth={true}
                open={true}
                style={{ margin: 0, padding: '1rem' }}
            >
                <form
                    onSubmit={this.onSubmit}
                    onKeyDown={ev => {
                        if (ev.key === 'Escape') {
                            ev.preventDefault()
                            this.onCancel()
                        }
                    }}
                >
                    <DialogTitle>
                        Edit Link
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={this.onCancel}
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
                    <DialogContent>
                        <div>
                            <TextField
                                label="Text"
                                margin="dense"
                                name="text"
                                onClick={e => e.stopPropagation()}
                                onChange={e =>
                                    this.setState({ text: e.target.value })
                                }
                                style={{ width: 310 }}
                                value={text}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div>
                            <LinkAutocomplete
                                items={this.props.items}
                                onChange={e =>
                                    this.setState({ href: e.target.value })
                                }
                                onSelect={this.onSelect}
                                value={this.state.href}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions
                        className={classes.actions}
                        style={{ padding: '.5rem 1rem 1rem' }}
                    >
                        <Button
                            onClick={this.onCancel}
                            style={{
                                textTransform: 'capitalize',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            disabled={this.state.href ? false : true}
                            style={{ textTransform: 'capitalize' }}
                            type="submit"
                            variant="contained"
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }
}

function onCloseModal() {}
