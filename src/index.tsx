import { addReducers, setGlobal } from 'reactn'
import { createRoot, hydrateRoot } from 'react-dom/client'
import initReactnPersist from 'reactn-persist'
import './lib/helper/globals'
import type { State } from 'reactn/default'
import './index.scss'
import App from './components/app'
import { initGA, setGA } from './components/Tracking'
import * as serviceWorker from './serviceWorker'

initGA('UA-151325933-1')
setGA({ anonymizeIp: true })

// addReactNDevTools()

// Remove console from production builds
if (process.env.NODE_ENV !== 'development') {
    function noop() { }
    console.log = noop
    console.warn = noop
    console.error = noop
}

addReducers({
    clearSearchComplete: (global, _dispatch) => ({
        files: [...global.initialFiles],
        isSearchFieldActive: false,
        oldSearchTerm: '',
        searchTerm: '',
        searchValue: '',
    }),
    clearSearchFiles: (global, _dispatch) => ({
        files: [...global.initialFiles],
    }),
    clearSearchMeta: (_global, _dispatch) => ({
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
    //debug: true,
    key: '@reactn', // Key in storage. Default '@reactn'.
    initialValue: initialState,
})

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element "#root" not found')
}
if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App />)
} else {
    createRoot(rootElement).render(<App />)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
