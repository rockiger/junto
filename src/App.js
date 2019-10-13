import React from 'reactn'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'

import Navbar from './components/Navbar'
import GoogleLogin from './components/googleLogin'
import Sidebar from './components/sidebar'
import Home from './components/home'
import Page from './components/page'

import {
    listFiles,
    createFile,
    updateFile,
    getFolderId,
    createNewWiki,
    refreshSession,
} from './lib/gdrive'

import {
    API_KEY,
    CLIENT_ID,
    DISCOVERY_DOCS,
    EMPTYVALUE,
    EXT,
    SCOPES,
    THEME,
} from './lib/constants'

import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    listFiles = async () => {
        const { searchTerm } = this.global
        const folderId = await getFolderId()
        console.log('searchTerm: ', searchTerm)
        if (folderId) {
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
                        this.listFiles()
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
            const newFolderId = await createNewWiki()
            const newFileId = await createFile(`Home${EXT}`, newFolderId)
            await updateFile(newFileId, EMPTYVALUE)
            // this.setState({folderId: newFolderId})
            console.log('newFolderId:', newFolderId)
            this.listFiles()
        }
    }

    setGoToNewFile = goToNewFile => this.setState({ goToNewFile })

    setIsSigningIn = isSigningIn => this.setState({ isSigningIn })

    onLogout = response => {
        this.setState({ isSignedIn: false })
    }

    render() {
        return (
            <ThemeProvider theme={THEME}>
                <Router>
                    <CssBaseline />
                    <div className="App">
                        <header className="App-header">
                            <Navbar isSignedIn={this.global.isSignedIn}>
                                <GoogleLogin
                                    clientId={CLIENT_ID}
                                    apiKey={API_KEY}
                                    discoveryDocs={DISCOVERY_DOCS}
                                    scope={SCOPES}
                                    buttonText="Login"
                                    onSuccess={this.onSuccess}
                                    onFailure={this.onFailure}
                                    onLogout={this.onLogout}
                                    isSignedIn={this.global.isSignedIn}
                                    setIsSigningIn={this.setIsSigningIn}
                                />
                            </Navbar>
                        </header>
                        <main className="App-main">
                            {this.global.isSignedIn && (
                                <aside className="App-sidebar">
                                    <Sidebar
                                        goToNewFile={this.global.goToNewFile}
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
                                            isSignedIn={this.global.isSignedIn}
                                            isSigningIn={
                                                this.global.isSigningIn
                                            }
                                            setGoToNewFile={this.setGoToNewFile}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/page/:id"
                                    render={props => (
                                        <Page
                                            {...props}
                                            isSignedIn={this.global.isSignedIn}
                                            isSigningIn={
                                                this.global.isSigningIn
                                            }
                                            setGoToNewFile={this.setGoToNewFile}
                                        />
                                    )}
                                />
                            </div>
                        </main>
                    </div>
                </Router>
            </ThemeProvider>
        )
    }
}

export default App
