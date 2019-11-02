import React from 'react'
import ReactDOM from 'react-dom'
import { sortByDate } from './SearchAutocomplete'

describe('SearchAutocomplete', () => {
    it('sortByDate works', () => {
        const date1 = '2019-10-17T20:19:28.006Z'
        const date2 = '2019-10-17T20:19:40.649Z'
        expect(sortByDate(undefined, undefined)).toBe(0)
        expect(sortByDate(undefined, date2)).toBe(1)
        expect(sortByDate(date1, undefined)).toBe(-1)
        expect(sortByDate(date1, date2)).toBe(1)
        expect(sortByDate(date2, date1)).toBe(-1)
        expect(sortByDate(date1, date1)).toBe(0)
    })
})
