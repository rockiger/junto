import React from 'react'
import ReactDOM from 'react-dom'
import { setGlobal } from 'reactn'

import { TestRouter } from '../../test-router'

setGlobal({
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: true,
    isSigningIn: true,
    goToNewFile: false,
    oldSearchTerm: '',
    redirect: false,
    searchTerm: '',
    searchValue: '',
    files: [],
    initialFiles: [],
    isInitialFileListLoading: false,
    backgroundUpdate: false,
    showSidebarOnMobile: false,
})

describe('Home', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<TestRouter initialPath="/" />, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})
