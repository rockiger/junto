// @ts-nocheck
//@ts-check
import React from 'react'
import { Navigate, useLocation } from '@tanstack/react-router'

export const Drive = () => {
    const { searchStr } = useLocation()
    const path = createPath(searchStr)

    return <Navigate to={path} replace />
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
