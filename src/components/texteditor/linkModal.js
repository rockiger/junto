import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import LinkAutocomplete from './linkAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@material-ui/core';
import CloseIcon from 'mdi-react/CloseIcon';


const useStyles = makeStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(2),
      color: theme.palette.grey[500],
    },
    actions: {
        padding: theme.spacing(1, 2, 2, 2),
    },
  }));

const LinkModal = props => {
    const classes = useStyles();
    return (
        <Dialog 
            aria-labelledby="form-dialog-title"
            className={classes.root}
            onClose={props.onCloseModal}  
            open={true /* props.isModalOpen */} 
        >
            <DialogTitle>
                Insert Link
                <IconButton 
                    aria-label="close" 
                    className={classes.closeButton}
                    onClick={props.onCloseModal}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <LinkAutocomplete 
                    items={props.autocompleteItems}
                    value={props.autocompleteValue}
                    onSelect={props.onSelectAutocomplete}
                    onChange={props.onChangeAutocomplete}
                />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button 
                    onClick={props.onCloseModal}
                >
                    Cancel
                </Button>
                <Button 
                    color="primary"
                    disabled={props.autocompleteValue ? false : true}
                    onClick={props.onClickSelectButton} 
                    variant="contained"
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
        
    )
}
LinkModal.propType = {
    isModalOpen: PropTypes.bool.isRequired,
    onClickSelectButton: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    // props for <Autocomplete
    autocompleteItems: PropTypes.array.isRequired,
    autocompleteValue: PropTypes.string.isRequired,
    onChangeAutocomplete: PropTypes.func.isRequired,
    onSelectAutocomplete: PropTypes.func.isRequired
}

export default LinkModal;

/* 
<ReactModal
            appElement={document.getElementById('root')}
            isOpen={props.isModalOpen}
            onRequestClose={props.onCloseModal}
            style={{
                overlay: {
                    zIndex: 1000,
                },
                content: {
                    bottom: 0,
                    height: '300px',
                    left: 0,
                    margin: 'auto',
                    maxHeight: '80vh',
                    maxWidth: '80vw',
                    position: 'relative',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '500px',
                }
            }}
        >
            <div onClick={props.onCloseModal}
                style={{
                    background: 'no-repeat url(//ssl.gstatic.com/docs/picker/images/onepick_sprite12.svg) 0 -146px',
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    right: 20,
                }}
            />
            <h2 style={{ fontWeight: 400, marginTop: 0, }}>Insert Link</h2>

            <LinkAutocomplete 
                items={props.autocompleteItems}
                value={props.autocompleteValue}
                onSelect={props.onSelectAutocomplete}
                onChange={props.onChangeAutocomplete}
            />
            
            <div className="button-bar"
                style={{
                    borderTop: '1px solid rgb(229, 229, 229)',
                    boxSizing: 'border-box',
                    left: 0,
                    padding: 20,
                    width: '100%',
                }}
            >
                <button className="action" onClick={props.onClickSelectButton}>Select</button> <button onClick={props.onCloseModal}>Cancel</button>
            </div>

        </ReactModal> */