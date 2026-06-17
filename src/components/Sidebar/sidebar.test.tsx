import { setGlobal } from 'reactn'

import { TestRouter } from '../../test-router'
import { renderToDiv } from '../../test-utils/renderToDiv'

setGlobal({
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: true,
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
        const { unmount } = renderToDiv(<TestRouter initialPath="/" />)
        unmount()
    })
})
