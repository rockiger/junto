import { sortByDate, getTitleFromFile } from './helper'
import { filesUpdaterHelper, filesUpdater } from './globalStateHelper'
import { EXT, OVERVIEW_NAME, MYHOME } from '../constants'

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
    // TODO write tests getTitleFromFile
})

describe('globalStateHelper', () => {
    test('filesUpdaterHelper', () => {
        const change1 = { name: 'Marco' }
        const id1 = 1
        const files1 = [{ id: 1, name: 'Marko' }]
        const expected1 = [{ id: 1, name: 'Marco' }]
        const id2 = 10
        const files2 = [
            { id: 1, name: 'Marco' },
            { id: 2, name: 'Caro' },
        ]
        const expected2 = [...files2]
        const now3 = new Date().toISOString()
        const change3 = {
            viewedByMe: true,
            viewedByMeTime: now3,
        }
        const expected3 = [
            {
                id: 1,
                name: 'Marco',
                viewedByMe: true,
                viewedByMeTime: now3,
            },
            { id: 2, name: 'Caro' },
        ]
        expect(filesUpdaterHelper(change1, [], id1)).toEqual([])
        expect(filesUpdaterHelper(change1, files1, id1)).toEqual(expected1)
        expect(filesUpdaterHelper(change1, files2, id2)).toEqual(expected2)
        expect(filesUpdaterHelper(change3, files2, id1)).toEqual(expected3)
    })
    test('filesUpdater', () => {
        const change1 = { name: 'Marco' }
        const id1 = 1
        const files1 = [{ id: 1, name: 'Marko' }]
        const global1 = { files: files1, initialFiles: files1 }
        const expected1 = {
            files: [{ id: 1, name: 'Marco' }],
            initialFiles: [{ id: 1, name: 'Marco' }],
        }
        expect(filesUpdater(change1, global1, id1)).toEqual(expected1)
    })
})
