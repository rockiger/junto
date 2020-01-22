// @ts-nocheck
import React from 'reactn'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'

import { CreateNewWiki } from 'components/CreateNewWiki'
import { Drive } from './components/Drive/index'
import Navbar from './components/Navbar'
import GoogleLogin from './components/googleLogin'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Page from './components/Page'
import { SharedWithMe } from 'components/SharedWithMe'
import { initGA, setGA } from './components/Tracking'

import {
    API_KEY,
    CLIENT_ID,
    DISCOVERY_DOCS,
    SCOPES,
    THEME,
} from './lib/constants'

import './App.css'

class App extends React.Component {
    componentDidMount() {
        initGA('UA-151325933-1')
        setGA({ anonymizeIp: true })
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
                                            isCreatingNewFile={
                                                this.global.isCreatingNewFile
                                            }
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
                                            isCreatingNewFile={
                                                this.global.isCreatingNewFile
                                            }
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
                                    path="/shared-with-me"
                                    render={props => (
                                        <SharedWithMe
                                            {...props}
                                            isCreatingNewFile={
                                                this.global.isCreatingNewFile
                                            }
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
                                    path="/drive/"
                                    render={props => <Drive />}
                                />
                                <Route
                                    exact
                                    path="/new/"
                                    render={props => (
                                        <CreateNewWiki
                                            isSignedIn={this.global.isSignedIn}
                                            isSigningIn={
                                                this.global.isSigningIn
                                            }
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
