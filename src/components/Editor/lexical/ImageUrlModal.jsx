import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from '@material-ui/core'
import CloseIcon from 'mdi-react/CloseIcon'

export class ImageUrlModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            url: '',
        }
        this.promiseInfo = {}
    }

    show = () => {
        return new Promise((resolve, reject) => {
            this.promiseInfo = { resolve, reject }
            this.setState({ show: true, url: '' })
        })
    }

    hide = () => {
        this.setState({ show: false })
    }

    onCancel = () => {
        this.hide()
        this.setState({ url: '' })
        this.promiseInfo.reject()
    }

    onSubmit = ev => {
        ev.preventDefault()
        const url = this.state.url.trim()
        if (!url) return
        this.hide()
        this.setState({ url: '' })
        this.promiseInfo.resolve(url)
    }

    render() {
        const { show, url } = this.state
        return !show ? null : (
            <Dialog
                aria-labelledby="image-url-dialog-title"
                fullWidth={true}
                onClose={() => {}}
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
                    <DialogTitle id="image-url-dialog-title">
                        Insert image by URL
                        <IconButton
                            aria-label="close"
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
                        <TextField
                            autoFocus
                            label="Image URL"
                            margin="dense"
                            name="url"
                            onChange={e =>
                                this.setState({ url: e.target.value })
                            }
                            style={{ width: '100%' }}
                            type="url"
                            value={url}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions style={{ padding: '.5rem 1rem 1rem' }}>
                        <Button
                            onClick={this.onCancel}
                            style={{ textTransform: 'capitalize' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            disabled={!url.trim()}
                            style={{ textTransform: 'capitalize' }}
                            type="submit"
                            variant="contained"
                        >
                            Insert
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }
}
