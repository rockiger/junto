import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import addReactNDevTools from 'reactn-devtools'
addReactNDevTools()

setGlobal({
    isFileListLoading: false,
    isSearchFieldActive: false,
    oldSearchTerm: '',
    redirect: false,
    searchTerm: '',
    files: [],
})

ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
    module.hot.accept()
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
