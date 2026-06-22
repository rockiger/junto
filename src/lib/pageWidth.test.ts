import { describe, expect, it } from 'bun:test'
import {
    PAGE_WIDTH_FULL,
    PAGE_WIDTH_REDUCED,
    parsePageContent,
    serializePageContent,
} from './pageWidth'

describe('pageWidth', () => {
    it('parses content without frontmatter', () => {
        expect(parsePageContent('# Hello\n\nWorld')).toEqual({
            pageWidth: PAGE_WIDTH_FULL,
            body: '# Hello\n\nWorld',
        })
    })

    it('parses reduced width from frontmatter', () => {
        const content = '---\npageWidth: reduced\n---\n# Hello'
        expect(parsePageContent(content)).toEqual({
            pageWidth: PAGE_WIDTH_REDUCED,
            body: '# Hello',
        })
    })

    it('omits frontmatter for full width on serialize', () => {
        expect(serializePageContent('# Hello', PAGE_WIDTH_FULL)).toBe('# Hello')
    })

    it('adds frontmatter for reduced width on serialize', () => {
        expect(serializePageContent('# Hello', PAGE_WIDTH_REDUCED)).toBe(
            '---\npageWidth: reduced\n---\n# Hello'
        )
    })

    it('round-trips reduced width', () => {
        const body = '# Title\n\nParagraph.'
        const serialized = serializePageContent(body, PAGE_WIDTH_REDUCED)
        expect(parsePageContent(serialized)).toEqual({
            pageWidth: PAGE_WIDTH_REDUCED,
            body,
        })
    })
})
