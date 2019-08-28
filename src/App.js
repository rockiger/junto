import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'

import { StateProvider } from './state'

import Navbar from './components/Navbar'
import GoogleLogin from './components/googleLogin'
import Sidebar from './components/sidebar'
import Home from './components/home'
import Page from './components/page'

import { CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } from './lib/constants'

import './App.css'

const initialState = {
    isFileListLoading: false,
    isSearchFieldActive: false,
    oldSearchTerm: '',
    redirect: false,
    searchTerm: '',
    files: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'ACTIVATE_SEARCH_FIELD':
            return {
                ...state,
                isSearchFieldActive: true,
            }
        case 'DEACTIVATE_SEARCH_FIELD':
            return {
                ...state,
                isSearchFieldActive: false,
            }
        case 'SET_FILES':
            return {
                ...state,
                files: action.payload.files,
                isFileListLoading: false,
                oldSearchTerm: action.payload.oldSearchTerm,
            }
        case 'SET_SEARCHTERM':
            return {
                ...state,
                oldSearchTerm: state.searchTerm,
                searchTerm: action.payload.searchTerm,
            }
        case 'FILELIST_LOADING':
            return {
                ...state,
                isFileListLoading: true,
            }
        case 'FILELIST_NOT_LOADING':
            return {
                ...state,
                isFileListLoading: false,
            }
        default:
            return state
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isSignedIn: false,
            isSigningIn: true,
            goToNewFile: false,
        }
    }

    setGoToNewFile = goToNewFile => this.setState({ goToNewFile })

    setIsSigningIn = isSigningIn => this.setState({ isSigningIn })

    onFailure = error => {
        console.log(JSON.stringify(error, null, 2))
    }

    onSuccess = () => {
        // Listen for sign-in state changes.
        window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(this.updateSigninStatus)
        // Handle the initial sign-in state.
        this.updateSigninStatus(
            window.gapi.auth2.getAuthInstance().isSignedIn.get()
        )
    }

    onLogout = response => {
        this.setState({ isSignedIn: false })
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus = isSignedIn => {
        this.setState({ isSignedIn, isSigningIn: false })
    }

    render() {
        return (
            <ThemeProvider theme={initialState.theme}>
                <StateProvider initialState={initialState} reducer={reducer}>
                    <Router>
                        <CssBaseline />
                        <div className="App">
                            <header className="App-header">
                                <Navbar isSignedIn={this.state.isSignedIn}>
                                    <GoogleLogin
                                        clientId={CLIENT_ID}
                                        apiKey={API_KEY}
                                        discoveryDocs={DISCOVERY_DOCS}
                                        scope={SCOPES}
                                        buttonText="Login"
                                        onSuccess={this.onSuccess}
                                        onFailure={this.onFailure}
                                        onLogout={this.onLogout}
                                        isSignedIn={this.state.isSignedIn}
                                        setIsSigningIn={this.setIsSigningIn}
                                    />
                                </Navbar>
                            </header>
                            <main className="App-main">
                                {this.state.isSignedIn && (
                                    <aside className="App-sidebar">
                                        <Sidebar
                                            goToNewFile={this.state.goToNewFile}
                                            setGoToNewFile={this.setGoToNewFile}
                                        />
                                    </aside>
                                )}
                                <div className="App-main-content">
                                    <Route
                                        exact
                                        path="/"
                                        render={props => (
                                            <Home
                                                {...props}
                                                isSignedIn={
                                                    this.state.isSignedIn
                                                }
                                                isSigningIn={
                                                    this.state.isSigningIn
                                                }
                                                setGoToNewFile={
                                                    this.setGoToNewFile
                                                }
                                            />
                                        )}
                                    />
                                    <Route
                                        exact
                                        path="/page/:id"
                                        render={props => (
                                            <Page
                                                {...props}
                                                isSignedIn={
                                                    this.state.isSignedIn
                                                }
                                                isSigningIn={
                                                    this.state.isSigningIn
                                                }
                                                setGoToNewFile={
                                                    this.setGoToNewFile
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </main>
                        </div>
                    </Router>
                </StateProvider>
            </ThemeProvider>
        )
    }
}

export default App
