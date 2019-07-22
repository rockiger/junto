// look into https://github.com/anthonyjgrove/react-google-login for more information
// and posibilitys with google authentication
/* global gapi */


import React from 'react';
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

export default class GoogleLogin extends React.Component {

    componentDidMount() {
        this.handleClientLoad();
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad = () => {
        this.props.setIsSigningIn(true)
        gapi.load('client:auth2', this.initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClient = () => {
        const {
            clientId,
            apiKey,
            discoveryDocs,
            scope,
        } = this.props
        window.gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs,
            scope,
        }).then(() => {
            this.props.onSuccess()
        }, function (error) {
            this.props.onFailure(error)
        });
    }


    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick = (event) => {
        this.props.setIsSigningIn(true)
        window.gapi.auth2.getAuthInstance().signIn()
            .then(
                user => {
                    console.log(user)
                },
                err => {
                    // end signingIn because breakup of process
                    this.props.setIsSigningIn(false)
                }
            );
    }

    render() {
        if (this.props.isSignedIn) {
            return (
                <Button>
                    Logout
                </Button>
            );
        } else {
            return (
                <Button variant="contained" color="primary"
                edge="end" id="authorize_button" className="action" onClick={this.handleAuthClick}>
                    {this.props.buttonText}
                </Button>
            );
        }
    }
}




/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut();
    event.preventDefault();
}

GoogleLogin.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,

    clientId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    scope: PropTypes.string,
    discoveryDocs: PropTypes.array,

    buttonText: PropTypes.node,
    isSignedIn: PropTypes.bool,
}

GoogleLogin.defaultProps = {
    isSignedIn: false,
    buttonText: 'Login with Google'
}