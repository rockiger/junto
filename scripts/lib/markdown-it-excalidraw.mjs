/**
 * Recognizes wiki Excalidraw references in markdown:
 *
 * ::: excalidraw zeichnung-a1b2c3d4.excalidraw.json
 * :::
 */
const EXCALIDRAW_START = /^::: excalidraw (.+?)\s*$/
const EXCALIDRAW_END = /^:::\s*$/

export function markdownItExcalidraw(md) {
	md.block.ruler.before(
		'fence',
		'wiki_excalidraw',
		(state, startLine, endLine, silent) => {
			const lineStart = state.bMarks[startLine] + state.tShift[startLine]
			const lineEnd = state.eMarks[startLine]
			const line = state.src.slice(lineStart, lineEnd)
			const openMatch = line.match(EXCALIDRAW_START)
			if (!openMatch) return false

			let nextLine = startLine + 1
			while (nextLine < endLine) {
				const bodyStart = state.bMarks[nextLine] + state.tShift[nextLine]
				const bodyEnd = state.eMarks[nextLine]
				const bodyLine = state.src.slice(bodyStart, bodyEnd)
				if (EXCALIDRAW_END.test(bodyLine)) break
				nextLine++
			}

			if (nextLine >= endLine) return false
			if (silent) return true

			const fileName = openMatch[1].trim()
			const token = state.push('wiki_excalidraw', 'div', 0)
			token.block = true
			token.map = [startLine, nextLine + 1]
			token.meta = { fileName }

			state.line = nextLine + 1
			return true
		},
	)

	md.renderer.rules.wiki_excalidraw = (tokens, idx) => {
		const { fileName } = tokens[idx].meta
		return `<div class="wiki-excalidraw" data-excalidraw-file="${fileName}"><em>Excalidraw: ${fileName}</em></div>`
	}
}
