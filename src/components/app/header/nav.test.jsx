import { setGlobal } from 'reactn'

import { TestRouter } from '../../../test-router'
import { renderToDiv } from '../../../test-utils/renderToDiv'

const baseGlobal = {
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
    goToNewFile: false,
    redirect: false,
    searchTerm: '',
    searchValue: '',
    files: [],
    initialFiles: [],
    isInitialFileListLoading: false,
    backgroundUpdate: false,
    showSidebarOnMobile: false,
    isSignedIn: false,
    isSigningIn: false,
}

describe('Nav', () => {
    it('renders without crashing', () => {
        setGlobal({ ...baseGlobal })
        const { unmount } = renderToDiv(<TestRouter initialPath="/" />)
        unmount()
    })
    it('has no searchbar if not signed in', () => {
        setGlobal({ ...baseGlobal, isSignedIn: false })
        const { container, unmount } = renderToDiv(
            <TestRouter initialPath="/" />,
        )
        expect(container.querySelector('[aria-label="Search"]')).toBeNull()
        unmount()
    })

    it('has a searchbar if signed in', () => {
        setGlobal({
            ...baseGlobal,
            isSignedIn: true,
            isInitialFileListLoading: false,
        })
        const { container, unmount } = renderToDiv(
            <TestRouter initialPath="/" />,
        )
        expect(container.innerHTML.includes('aria-label="Search"')).toBe(true)
        unmount()
    })
})
