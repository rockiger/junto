// look into https://github.com/anthonyjgrove/react-google-login for more information
// and posibilitys with google authentication
/* global gapi, firebase */

import React from 'reactn'
import PropTypes from 'prop-types'
import IconButton from 'components/gsuite-components/icon-button'
import Button from 'components/gsuite-components/button'

import LogoutIcon from 'mdi-react/LogoutIcon'

import {
    listFilesChunked as listFiles,
    createFile,
    updateFile,
    getFolderId,
    createNewWiki,
    refreshSession,
} from '../lib/gdrive'

import { OVERVIEW_VALUE, OVERVIEW_NAME } from '../lib/constants'

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
            backgroundUpdate,
        } = this.global
        console.log(
            'componentDidUpdate:',
            isFileListLoading,
            oldSearchTerm,
            searchTerm
        )
        if (!isFileListLoading && oldSearchTerm !== searchTerm && isSignedIn) {
            if (searchTerm) {
                this.updateFiles()
            } else {
                this.setGlobal({ files: this.global.initialFiles })
            }
        }

        if (backgroundUpdate) {
            console.log('backgroundUpdate')
            this.backgroundUpdateFiles()
        }
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad = () => {
        this.setGlobal({ isSigningIn: true })
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
                (error) => {
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
        addSignIn(
            gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
        )
    }

    /**
     * Initially load files, get the rootFolderId
     */
    initFiles = async () => {
        console.log('initFiles')
        this.setGlobal({
            isFileListLoading: true,
            isInitialFileListLoading: true,
        })
        const rootFolderId = await getFolderId()
        if (rootFolderId) {
            try {
                const files = await listFiles()
                this.setState({ isLoading: false })
                this.setGlobal({
                    files,
                    initialFiles: files,
                    isFileListLoading: false,
                    rootFolderId,
                    isInitialFileListLoading: false,
                })
            } catch (err) {
                console.log({ err })
                const body = err.body ? JSON.parse(err.body) : {}
                const { error } = body
                if (error && error.message === 'Invalid Credentials') {
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
            const newFileId = await createFile(OVERVIEW_NAME, newRootFolderId)
            await updateFile(newFileId, OVERVIEW_VALUE)
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newRootFolderId)
            this.initFiles()
        }
    }

    /**
     * Initially load files, get the rootFolderId
     */
    updateFiles = async () => {
        console.log('updateFiles')
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

    /**
     * Initially load files, get the rootFolderId
     */
    backgroundUpdateFiles = async () => {
        console.log('backgroundUpdateFiles')
        const { rootFolderId, searchTerm } = this.global
        if (rootFolderId) {
            try {
                const files = await listFiles(searchTerm)
                this.setGlobal({
                    backgroundUpdate: false,
                    files,
                    initialFiles: files,
                    isFileListLoading: false,
                    oldSearchTerm: searchTerm,
                })
            } catch (err) {
                const body = JSON.parse(err.body)
                const { error } = body
                if (error.message === 'Invalid Credentials') {
                    try {
                        await refreshSession()
                        this.backgroundUpdate()
                    } catch (err) {
                        alert(`Couldn't refresh session: ${err.message}`)
                        console.log({ err })
                    }
                } else {
                    alert(`Couldn't update files ${err}`)
                    console.log({ error })
                }
            }
        }
    }

    onFailure = (error) => {
        alert(`We couldn't sign you in. Please reload your app and try again.`)
        console.log(JSON.stringify(error, null, 2))
        this.setState({ isSigningIn: false })
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus = (isSignedIn) => {
        console.log({ isSignedIn })
        this.setGlobal({ isSignedIn, isSigningIn: false })
        if (isSignedIn && !this.global.isFileListLoading) this.initFiles()
    }

    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick = (event) => {
        this.setGlobal({ isSigningIn: true })
        window.gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(
                (user) => {
                    console.log(user)
                },
                (err) => {
                    // end signingIn because breakup of process
                    this.setGlobal({ isSigningIn: false })
                }
            )
    }

    render() {
        if (this.global.isSignedIn) {
            return (
                <IconButton id="LogoutButton" onClick={handleSignoutClick}>
                    <LogoutIcon />
                </IconButton>
            )
        } else {
            return (
                <span>
                    <Button
                        color="primary"
                        edge="end"
                        id="authorize_button"
                        className="action"
                        onClick={this.handleAuthClick}
                    >
                        {this.props.buttonText}
                    </Button>
                </span>
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

/**
 * Add Sign In do database
 * @param {obeject} profile - the basic probfile of the user
 */
function addSignIn(profile) {
    // Your web app's Firebase configuration

    var firebaseConfig = {
        apiKey: 'AIzaSyBFOb4rpamVzanv8TcFn05fTb6bo4DZbVU',
        authDomain: 'fulcrum-users.firebaseapp.com',
        databaseURL: 'https://fulcrum-users.firebaseio.com',
        projectId: 'fulcrum-users',
        storageBucket: 'fulcrum-users.appspot.com',
        messagingSenderId: '841108083969',
        appId: '1:841108083969:web:4ddf31eeec6e2da20f7700',
        measurementId: 'G-3T6B47CFLG',
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)

    const db = firebase.firestore()
    db.collection('users')
        .add({
            email: profile.getEmail(),
            first: profile.getGivenName(),
            last: profile.getFamilyName(),
            avatar: profile.getImageUrl(),
            created: new Date(),
        })
        .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id)
        })
        .catch(function (error) {
            console.error('Error adding document: ', error)
        })
}

GoogleLogin.propTypes = {
    clientId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    scope: PropTypes.string,
    discoveryDocs: PropTypes.array,

    buttonText: PropTypes.node,
}

GoogleLogin.defaultProps = {
    isSignedIn: false,
    buttonText: 'Login with Google',
}
