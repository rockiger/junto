/**
 * Recognizes wiki column layouts in markdown:
 *
 * ::: layout 1fr 1fr
 * left column
 * :::column
 * right column
 * :::
 */
const LAYOUT_START = /^::: layout (.+?)\s*$/
const LAYOUT_END = /^:::\s*$/
const LAYOUT_COLUMN = /^:::column\s*$/

export function markdownItLayout(md) {
	md.block.ruler.before(
		'fence',
		'wiki_layout',
		(state, startLine, endLine, silent) => {
			const lineStart = state.bMarks[startLine] + state.tShift[startLine]
			const lineEnd = state.eMarks[startLine]
			const line = state.src.slice(lineStart, lineEnd)
			const openMatch = line.match(LAYOUT_START)
			if (!openMatch) return false

			let nextLine = startLine + 1
			while (nextLine < endLine) {
				const bodyStart = state.bMarks[nextLine] + state.tShift[nextLine]
				const bodyEnd = state.eMarks[nextLine]
				const bodyLine = state.src.slice(bodyStart, bodyEnd)
				if (LAYOUT_END.test(bodyLine)) break
				nextLine++
			}

			if (nextLine >= endLine) return false
			if (silent) return true

			const bodyLines = []
			for (let i = startLine + 1; i < nextLine; i++) {
				const bodyStart = state.bMarks[i] + state.tShift[i]
				const bodyEnd = state.eMarks[i]
				bodyLines.push(state.src.slice(bodyStart, bodyEnd))
			}

			const columns = [[]]
			for (const bodyLine of bodyLines) {
				if (LAYOUT_COLUMN.test(bodyLine)) {
					columns.push([])
				} else {
					columns[columns.length - 1].push(bodyLine)
				}
			}

			const template = openMatch[1].trim()
			const token = state.push('wiki_layout', 'div', 0)
			token.block = true
			token.map = [startLine, nextLine + 1]
			token.meta = { columns, template }

			state.line = nextLine + 1
			return true
		},
	)

	md.renderer.rules.wiki_layout = (tokens, idx) => {
		const { columns, template } = tokens[idx].meta
		const items = columns
			.map((lines) => {
				const inner = md.render(lines.join('\n'))
				return `<div class="wiki-layout-item" data-lexical-layout-item="true">${inner}</div>`
			})
			.join('')
		return `<div class="wiki-layout-container" data-lexical-layout-container="true" style="grid-template-columns:${template}">${items}</div>`
	}
}
