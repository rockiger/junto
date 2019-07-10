import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Nav from './components/nav';
import GoogleLogin from './components/googleLogin';
import Sidebar from './components/sidebar';
import Home from './components/home';
import Page from './components/page';

import { CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } from './lib/constants';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            toFile: false,
        };
    }

    setToFile = toFile => this.setState({ toFile });

    onFailure = error => {
        console.log(JSON.stringify(error, null, 2));
    };

    onSuccess = () => {
        this.setState({ isSignedIn: true });
        // Listen for sign-in state changes.
        window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(isSignedIn => this.setState({ isSignedIn }));
        // Handle the initial sign-in state.
        this.updateSigninStatus(
            window.gapi.auth2.getAuthInstance().isSignedIn.get(),
        );
    };

    onLogout = response => {
        this.setState({ isSignedIn: false });
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus = isSignedIn => {
        this.setState({ isSignedIn });
    };
    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <Nav isSignedIn={this.state.isSignedIn}>
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
                            />
                        </Nav>
                    </header>
                    <main className="App-main">
                        {this.state.isSignedIn && (
                            <aside className="App-sidebar">
                                <Sidebar
                                    toFile={this.state.toFile}
                                    setToFile={this.setToFile}
                                />
                            </aside>
                        )}
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <Home
                                    {...props}
                                    isSignedIn={this.state.isSignedIn} setToFile={this.setToFile}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/page/:id"
                            render={props => (
                                <Page
                                    {...props}
                                    isSignedIn={this.state.isSignedIn}
                                    setToFile={this.setToFile}
                                />
                            )}
                        />
                    </main>
                </div>
            </Router>
        );
    }
}

export default App;
