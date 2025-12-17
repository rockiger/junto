import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Grid,
    Typography,
} from '@material-ui/core'
import CloseIcon from 'mdi-react/CloseIcon'

const classes = {}

export class CreateNewWikiModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            name: '',
            href: '',
        }
        this.promiseInfo = {}
    }

    show = async () => {
        return new Promise((resolve, reject) => {
            this.promiseInfo = {
                resolve,
                reject,
            }
            this.setState({ show: true })
        })
    }

    hide = () => {
        this.setState({
            show: false,
        })
    }

    onCancel = () => {
        this.hide()
        this.setState({ description: '', name: '' })
        this.promiseInfo.reject()
    }

    onSubmit = ev => {
        ev.preventDefault()
        this.hide()
        this.promiseInfo.resolve({
            description: this.state.description,
            name: this.state.name,
        })
        this.setState({ href: '', text: '' })
    }

    render() {
        const { description, show, name } = this.state
        return !show ? null : (
            <Dialog
                aria-labelledby="form-dialog-title"
                onClose={this.onCancel}
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
                        Create New Wiki
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
                    <DialogContent style={{ overflowY: 'visible' }}>
                        <Grid
                            alignItems="flex-start"
                            container
                            direction="row"
                            justify="space-between"
                            spacing={6}
                        >
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    label="Fulcrum Name"
                                    margin="dense"
                                    name="name"
                                    onClick={e => e.stopPropagation()}
                                    onChange={e =>
                                        this.setState({
                                            name: e.target.value,
                                        })
                                    }
                                    required={true}
                                    style={{ width: '100%' }}
                                    value={name}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Description"
                                    margin="dense"
                                    multiline={true}
                                    name="description"
                                    onClick={e => e.stopPropagation()}
                                    onChange={e =>
                                        this.setState({
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Optional: What is this wiki for?"
                                    rows={4}
                                    style={{ width: '100%' }}
                                    value={description}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Typography
                                    style={{ margin: '.25rem 0 .5rem 0' }}
                                    variant="subtitle2"
                                >
                                    About wikis
                                </Typography>
                                <Typography variant="body2">
                                    Share knowledge, manage documentation and
                                    colaborate with your team. You can add pages
                                    and keep them organised in a hierarchy.
                                </Typography>
                            </Grid>
                        </Grid>
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
                            disabled={this.state.name ? false : true}
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
