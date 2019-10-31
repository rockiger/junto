import React from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, cleanup } from '@testing-library/react'

import App from './App'

afterEach(cleanup)

it('Spinner shows after button clickte', () => {
    const { getByText, debug, container } = render(<App />)
    expect(getByText(/Knowledge/i).textContent).toBe(
        'Knowledge Base for Google Drive!'
    )
    fireEvent.click(getByText('Login with Google'))
    debug()
    //expect(getByText(/Knowledge/i).textContent).toBe(null)
})
