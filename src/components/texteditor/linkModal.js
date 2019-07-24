import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import LinkAutocomplete from './linkAutocomplete';

const LinkModal = props => {
    return (
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

        </ReactModal>
    )
}
LinkModal.propType = {
    autocompleteValue: PropTypes.string.isRequired,
    autocompleteItems: PropTypes.array.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    onChangeAutocomplete: PropTypes.func.isRequired,
    onClickSelectButton: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSelectAutocomplete: PropTypes.func.isRequired
}

export default LinkModal;