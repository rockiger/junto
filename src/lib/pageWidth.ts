export const PAGE_WIDTH_FULL = 'full' as const
export const PAGE_WIDTH_REDUCED = 'reduced' as const

export type PageWidth = typeof PAGE_WIDTH_FULL | typeof PAGE_WIDTH_REDUCED

export const DEFAULT_PAGE_WIDTH: PageWidth = PAGE_WIDTH_FULL

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const PAGE_WIDTH_RE = /^pageWidth:\s*(full|reduced)\s*$/m

export const PAGE_READING_MAX_WIDTH_PX = 640

export function parsePageContent(content: string): {
    pageWidth: PageWidth
    body: string
} {
    const match = content.match(FRONTMATTER_RE)
    if (!match) {
        return { pageWidth: DEFAULT_PAGE_WIDTH, body: content }
    }

    const widthMatch = match[1].match(PAGE_WIDTH_RE)
    const pageWidth = (widthMatch?.[1] as PageWidth) ?? DEFAULT_PAGE_WIDTH
    const body = content.slice(match[0].length)

    return { pageWidth, body }
}

export function serializePageContent(
    body: string,
    pageWidth: PageWidth
): string {
    if (pageWidth === DEFAULT_PAGE_WIDTH) {
        return body
    }

    return `---\npageWidth: ${pageWidth}\n---\n${body}`
}
