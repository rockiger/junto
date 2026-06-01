import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'

import { TestRouter } from '../../test-router'

setGlobal({
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: false,
    isSigningIn: true,
    goToNewFile: false,
    redirect: false,
    searchTerm: '',
    searchValue: '',
    files: [],
    initialFiles: [],
    isInitialFileListLoading: false,
    backgroundUpdate: false,
    showSidebarOnMobile: false,
})

describe('Sidebar', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <TestRouter initialPath="/" />,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
