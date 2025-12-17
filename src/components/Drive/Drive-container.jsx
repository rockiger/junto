//@ts-check
import React from 'react'
import { Redirect, useLocation } from 'react-router'

export const Drive = () => {
    const location = useLocation()
    const { search } = location
    console.log(search)
    const path = createPath(search)

    return <Redirect to={path} />
}

/**
 *
 * @param {string} search
 * @returns {string}
 */
export const createPath = search => {
    const urlParams = new URLSearchParams(search)
    const stateString = urlParams.get('state')

    if (stateString && typeof stateString === 'string') {
        const state = JSON.parse(stateString)
        const id = state.ids ? state.ids[0] : ''
        const path = id ? `/page/${id}` : '/'
        return path
    }
    return '/'
}
