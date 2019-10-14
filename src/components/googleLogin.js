// look into https://github.com/anthonyjgrove/react-google-login for more information
// and posibilitys with google authentication
/* global gapi */

import React from 'reactn'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import LogoutIcon from 'mdi-react/LogoutIcon'

import {
    listFiles,
    createFile,
    updateFile,
    getFolderId,
    createNewWiki,
    refreshSession,
} from '../lib/gdrive'

import { EMPTYVALUE, EXT } from '../lib/constants'

export default class GoogleLogin extends React.Component {
    componentDidMount() {
        this.handleClientLoad()
    }

    componentDidUpdate() {
        const {
            isFileListLoading,
            isSignedIn,
            oldSearchTerm,
            searchTerm,
        } = this.global
        console.log(
            'componentDidUpdate:',
            isFileListLoading,
            oldSearchTerm,
            searchTerm
        )
        if (!isFileListLoading && oldSearchTerm !== searchTerm && isSignedIn) {
            this.updateFiles()
        }
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad = () => {
        this.props.setIsSigningIn(true)
        gapi.load('client:auth2', this.initClient)
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClient = () => {
        const { clientId, apiKey, discoveryDocs, scope } = this.props
        window.gapi.client
            .init({
                apiKey,
                clientId,
                discoveryDocs,
                scope,
            })
            .then(
                () => {
                    this.onSuccess()
                },
                error => {
                    this.onFailure(error)
                }
            )
    }

    onSuccess = () => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
        // Handle the initial sign-in state.
        this.updateSigninStatus(
            window.gapi.auth2.getAuthInstance().isSignedIn.get()
        )
    }

    /**
     * Initially load files, get the rootFolderId
     */
    initFiles = async () => {
        this.setGlobal({ isFileListLoading: true })
        const rootFolderId = await getFolderId()
        if (rootFolderId) {
            try {
                const files = await listFiles()
                console.log('listFiles:', files)
                this.setState({ isLoading: false })
                this.setGlobal({
                    files,
                    isFileListLoading: false,
                    rootFolderId,
                })
            } catch (err) {
                const body = JSON.parse(err.body)
                const { error } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        this.initFiles()
                    } catch (err) {
                        alert(`Couldn't refresh session: ${err.message}`)
                        console.log({ err })
                    }
                } else {
                    alert(`Couldn't load files ${err}`)
                    console.log({ error })
                }
            }
        } else {
            const newRootFolderId = await createNewWiki()
            const newFileId = await createFile(`Fulcrum${EXT}`, newRootFolderId)
            await updateFile(newFileId, EMPTYVALUE)
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newRootFolderId)
            this.initFiles()
        }
    }

    /**
     * Initially load files, get the rootFolderId
     */
    updateFiles = async () => {
        this.setGlobal({ isFileListLoading: true })
        const { rootFolderId, searchTerm } = this.global
        if (rootFolderId) {
            try {
                const files = await listFiles(searchTerm)
                console.log('listFiles:', files)
                this.setState({ isLoading: false })
                this.setGlobal({
                    files,
                    isFileListLoading: false,
                    oldSearchTerm: searchTerm,
                })
            } catch (err) {
                const body = JSON.parse(err.body)
                const { error } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        this.updateFiles()
                    } catch (err) {
                        alert(`Couldn't refresh session: ${err.message}`)
                        console.log({ err })
                    }
                } else {
                    alert(`Couldn't load files ${err}`)
                    console.log({ error })
                }
            }
        }
    }

    onFailure = error => {
        alert(`We couldn't sign you in. Please reload your app and try again.`)
        console.log(JSON.stringify(error, null, 2))
        this.setState({ isSigningIn: false })
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus = isSignedIn => {
        console.log({ isSignedIn })
        this.setGlobal({ isSignedIn, isSigningIn: false })
        if (isSignedIn) this.initFiles()
    }

    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick = event => {
        this.setGlobal({ isSigningIn: true })
        window.gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(
                user => {
                    console.log(user)
                },
                err => {
                    // end signingIn because breakup of process
                    this.setGlobal({ isSigningIn: false })
                }
            )
    }

    render() {
        if (this.props.isSignedIn) {
            return (
                <IconButton onClick={handleSignoutClick}>
                    <LogoutIcon />
                </IconButton>
            )
        } else {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    edge="end"
                    id="authorize_button"
                    className="action"
                    onClick={this.handleAuthClick}
                >
                    {this.props.buttonText}
                </Button>
            )
        }
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut()
    event.preventDefault()
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
    buttonText: 'Login with Google',
}
