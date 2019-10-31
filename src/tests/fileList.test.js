import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import { render, fireEvent, cleanup } from '@testing-library/react'

import FileList from '../components/fileList'

afterEach(cleanup)
const date1 = new Date()
const date2 = new Date()
date2.setDate(date2.getDate() - 3)
const date3 = new Date()
date3.setDate(date3.getDate() - 15)
const date4 = new Date()
date4.setDate(date4.getDate() - 50)
const date5 = new Date()
date5.setDate(date4.getDate() - 1)

const files = [
    { id: 'id1', name: 'File 1', modifiedByMeTime: date1.toISOString() },
    { id: 'id2', name: 'File 2', modifiedByMeTime: date2.toISOString() },
    { id: 'id3', name: 'File 3', modifiedByMeTime: date3.toISOString() },
    { id: 'id4', name: 'File 4', modifiedByMeTime: date4.toISOString() },
    { id: 'id5', name: 'File 5', modifiedByMeTime: date5.toISOString() },
]

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

it('Text in in headline', () => {
    const { getByText, debug } = render(<FileList />)

    expect(getByText(/Your Work/i).textContent).toBe('Your Work')
})
