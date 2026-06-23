import { EXT } from 'lib/constants'
import {
    filterSearchResultFiles,
    isWikiPageForSearch,
    normalizeSearchQueryParam,
} from './search-helper'

function makeFile(overrides = {}) {
    return {
        id: '1',
        name: `page${EXT}`,
        mimeType: 'application/json',
        trashed: false,
        ...overrides,
    }
}

describe('normalizeSearchQueryParam', () => {
    test('returns string q unchanged', () => {
        expect(normalizeSearchQueryParam('foo bar')).toBe('foo bar')
    })

    test('non-string becomes empty string', () => {
        expect(normalizeSearchQueryParam(undefined)).toBe('')
        expect(normalizeSearchQueryParam(42)).toBe('')
    })
})

describe('isWikiPageForSearch', () => {
    test('accepts wiki json pages', () => {
        expect(isWikiPageForSearch(makeFile())).toBe(true)
    })

    test('rejects folders and trashed files', () => {
        expect(
            isWikiPageForSearch(
                makeFile({
                    mimeType: 'application/vnd.google-apps.folder',
                }),
            ),
        ).toBe(false)
        expect(isWikiPageForSearch(makeFile({ trashed: true }))).toBe(false)
    })
})

describe('filterSearchResultFiles', () => {
    test('keeps only searchable wiki pages', () => {
        const files = [
            makeFile({ id: 'a' }),
            makeFile({
                id: 'b',
                mimeType: 'application/vnd.google-apps.folder',
            }),
        ]
        expect(filterSearchResultFiles(files).map((f) => f.id)).toEqual(['a'])
    })
})
