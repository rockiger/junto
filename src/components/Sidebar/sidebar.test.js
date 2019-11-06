import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'

import Sidebar from './'

setGlobal({
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
})

describe('Sidebar', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <MemoryRouter>
                <Sidebar files={[]} />
            </MemoryRouter>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })
})
