import React from 'react'
import ReactDOM from 'react-dom'
import { setGlobal } from 'reactn'

import { TestRouter } from '../../../test-router'

const baseGlobal = {
    isCreatingNewFile: false,
    rootFolderId: null,
    isFileListLoading: false,
    isSearchFieldActive: false,
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
    isSignedIn: false,
    isSigningIn: false,
}

describe('Nav', () => {
    it('renders without crashing', () => {
        setGlobal({ ...baseGlobal })
        const div = document.createElement('div')
        ReactDOM.render(<TestRouter initialPath="/" />, div)
        ReactDOM.unmountComponentAtNode(div)
    })
    it('has no searchbar if not signed in', () => {
        setGlobal({ ...baseGlobal, isSignedIn: false })
        const div = document.createElement('div')
        ReactDOM.render(<TestRouter initialPath="/" />, div)
        expect(div.querySelector('[aria-label="Search"]')).toBeNull()
        ReactDOM.unmountComponentAtNode(div)
    })

    it('has a searchbar if signed in', () => {
        setGlobal({
            ...baseGlobal,
            isSignedIn: true,
            isInitialFileListLoading: false,
        })
        const div = document.createElement('div')
        ReactDOM.render(<TestRouter initialPath="/" />, div)
        expect(div.innerHTML.includes('aria-label="Search"')).toBe(true)
        ReactDOM.unmountComponentAtNode(div)
    })
})
