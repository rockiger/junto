import { describe, expect, it } from 'bun:test'
import {
    classifyLinkUrl,
    googleIconUrlForMime,
    parseWikiPageId,
} from '../src/components/Editor/lexical/lib/classifyLinkUrl.js'

describe('classifyLinkUrl', () => {
    it('detects Google Docs', () => {
        const info = classifyLinkUrl(
            'https://docs.google.com/document/d/abc123/edit'
        )
        expect(info?.kind).toBe('document')
        expect(info?.fileId).toBe('abc123')
        expect(info?.iconUrl).toBe(
            googleIconUrlForMime('application/vnd.google-apps.document')
        )
    })

    it('detects Drive file URLs and marks them for fetch', () => {
        const info = classifyLinkUrl(
            'https://drive.google.com/file/d/xyz/view?usp=drivesdk'
        )
        expect(info?.kind).toBe('drive-file')
        expect(info?.fileId).toBe('xyz')
        expect(info?.needsFetch).toBe(true)
    })

    it('detects internal wiki page links', () => {
        expect(classifyLinkUrl('/page/abc')).toEqual({
            fileId: 'abc',
            kind: 'wiki',
        })
        expect(
            classifyLinkUrl('https://app.example.com/page/xyz?edit=1')
        ).toEqual({
            fileId: 'xyz',
            kind: 'wiki',
        })
    })

    it('parseWikiPageId extracts page ids', () => {
        expect(parseWikiPageId('/page/abc')).toBe('abc')
        expect(parseWikiPageId('https://example.com/page/xyz')).toBe('xyz')
        expect(parseWikiPageId('https://example.com')).toBeNull()
    })

    it('ignores regular links', () => {
        expect(classifyLinkUrl('https://example.com')).toBeNull()
        expect(classifyLinkUrl('[not a url]')).toBeNull()
    })
})
