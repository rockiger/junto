import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import { State } from 'reactn/default'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import addReactNDevTools from 'reactn-devtools'

addReactNDevTools()

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

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
