import { sortByDate, getTitleFromFile } from './helper'
import { EXT, OVERVIEW_NAME, MYHOME } from './constants'

describe('Helper', () => {
    test('sortByDate', () => {
        const date1 = '2019-10-17T20:19:28.006Z'
        const date2 = '2019-10-17T20:19:40.649Z'
        expect(sortByDate(undefined, undefined)).toBe(0)
        expect(sortByDate(undefined, date2)).toBe(1)
        expect(sortByDate(date1, undefined)).toBe(-1)
        expect(sortByDate(date1, date2)).toBe(1)
        expect(sortByDate(date2, date1)).toBe(-1)
        expect(sortByDate(date1, date1)).toBe(0)
    })
    test('getTitleFromFile', () => {
        const file1 = { name: `name${EXT}` }
        const file2 = { name: `folderName`, properties: { wikiRoot: true } }
        const file3 = { name: `folderName`, properties: {} }
        const file4 = { name: OVERVIEW_NAME }

        expect(getTitleFromFile(file1)).toBe('name')
        expect(getTitleFromFile(file2)).toBe('folderName')
        expect(getTitleFromFile(file3)).toBe(
            'folderName'.substr(0, 'folderName'.length - EXT.length)
        )
        expect(getTitleFromFile(file4)).toBe(MYHOME)
    })
})

// TODO write tests getTitleFromFile
