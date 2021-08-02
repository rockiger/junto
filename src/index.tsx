import React, { addReducers, setGlobal } from 'reactn'
import { hydrate, render } from 'react-dom'
import initReactnPersist from 'reactn-persist'
import './lib/helper/globals'
import { State } from 'reactn/default'
import './index.scss'
import App from 'components/app'
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

addReducers({
    clearSearch: async (global, dispatch) => {
        await dispatch.clearSearchMeta()
        await dispatch.clearSearchFiles()
    },
    clearSearchFiles: (global, dispatch) => ({
        files: [...global.initialFiles],
    }),
    clearSearchMeta: (global, dispatch) => ({
        isSearchFieldActive: false,
        oldSearchTerm: '',
        searchTerm: '',
        searchValue: '',
    }),
})

const initialState: State = {
    backgroundUpdate: false,
    files: [],
    goToNewFile: false,
    hints: {},
    hintsFileId: '',
    hintCounter: 0,
    initialFiles: [],
    isCreatingNewFile: false,
    isFileListLoading: false,
    isInitialFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: false,
    isSigningIn: true,
    oldSearchTerm: '',
    redirect: false,
    rootFolderId: null,
    searchTerm: '',
    searchValue: '', // The value in the searchfield
    showSidebarOnMobile: false,
    userId: '',
}
setGlobal(initialState)

initReactnPersist({
    // REQUIRED.
    storage: localStorage, // localStorage, sessionStorage or any instance with Storage API interface support.
    // Optional.
    whitelist: ['files', 'hints', 'initialFiles', 'rootFolderId'], // List of top-level keys in global, like ['users', 'token']. Default [].
    debug: true,
    key: '@reactn', // Key in storage. Default '@reactn'.
    initialValue: initialState,
})

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
