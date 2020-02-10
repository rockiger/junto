import React, { addReducer, setGlobal } from 'reactn'
import { hydrate, render } from 'react-dom'
import { State } from 'reactn/default'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import addReactNDevTools from 'reactn-devtools'

addReactNDevTools()

// Remove console from production builds
if (process.env.NODE_ENV !== 'development') {
    function noop() {}
    console.log = noop
    console.warn = noop
    console.error = noop
}

// When the increment reducer is called, increment the global value by X.
addReducer('clearSearch', (global, dispatch, x = 1) => ({
    files: [...global.initialFiles],
    isSearchFieldActive: false,
    oldSearchTerm: '',
    searchTerm: '',
}))

const initialState: State = {
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: false,
    isSigningIn: true,
    goToNewFile: false,
    oldSearchTerm: '',
    redirect: false,
    searchTerm: '',
    searchValue: '', // The value in the searchfield
    files: [],
    initialFiles: [],
    isInitialFileListLoading: false,
    backgroundUpdate: false,
}
setGlobal(initialState)

const rootElement = document.getElementById('root')
if (rootElement!.hasChildNodes()) {
    hydrate(<App />, rootElement)
} else {
    render(<App />, rootElement)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
