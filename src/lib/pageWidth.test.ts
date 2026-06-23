import { describe, expect, it } from 'bun:test'
import {
    PAGE_WIDTH_FULL,
    PAGE_WIDTH_REDUCED,
    parsePageContent,
    serializePageContent,
} from './pageWidth'

describe('pageWidth', () => {
    it('parses content without frontmatter as reduced width', () => {
        expect(parsePageContent('# Hello\n\nWorld')).toEqual({
            pageWidth: PAGE_WIDTH_REDUCED,
            body: '# Hello\n\nWorld',
        })
    })

    it('parses full width from frontmatter', () => {
        const content = '---\npageWidth: full\n---\n# Hello'
        expect(parsePageContent(content)).toEqual({
            pageWidth: PAGE_WIDTH_FULL,
            body: '# Hello',
        })
    })

    it('omits frontmatter for reduced width on serialize', () => {
        expect(serializePageContent('# Hello', PAGE_WIDTH_REDUCED)).toBe(
            '# Hello'
        )
    })

    it('adds frontmatter for full width on serialize', () => {
        expect(serializePageContent('# Hello', PAGE_WIDTH_FULL)).toBe(
            '---\npageWidth: full\n---\n# Hello'
        )
    })

    it('round-trips full width', () => {
        const body = '# Title\n\nParagraph.'
        const serialized = serializePageContent(body, PAGE_WIDTH_FULL)
        expect(parsePageContent(serialized)).toEqual({
            pageWidth: PAGE_WIDTH_FULL,
            body,
        })
    })
})
