/**
 * Slate 0.47 Value (JSON) -> Markdown, aligned with the Junto material editor.
 */

/** @param {any} m */
function markType(m) {
	if (m == null) return null
	if (typeof m === "string") return m
	return m.type ?? m
}

/**
 * @param {any[]|undefined} marks
 * @returns {string[]}
 */
function normalizeMarkList(marks) {
	if (!marks || !marks.length) return []
	return marks.map((m) => markType(m)).filter(Boolean)
}

/**
 * @param {any} textNode
 * @returns {{ text: string, marks: string[] }[]}
 */
export function getTextParts(textNode) {
	if (textNode.object !== "text") return []
	if (textNode.leaves && textNode.leaves.length) {
		return textNode.leaves.map((leaf) => ({
			text: leaf.text ?? "",
			marks: normalizeMarkList(leaf.marks),
		}))
	}
	return [
		{
			text: textNode.text ?? "",
			marks: normalizeMarkList(textNode.marks),
		},
	]
}

/**
 * @param {string} json
 * @returns {{ object: string, data?: any, nodes: any[] }}
 */
export function parseGwikiDocument(json) {
	const v = JSON.parse(json)
	if (v.object === "value" && v.document && v.document.object === "document") {
		return v.document
	}
	if (v.object === "document" && v.nodes) {
		return v
	}
	throw new Error("Not a Slate 0.47 value: expected object:value with document or a document")
}

/** @param {any} d */
export function getData(d) {
	if (d == null) return {}
	if (typeof d.get === "function") {
		return d.toJSON ? d.toJSON() : {}
	}
	return typeof d === "object" && !Array.isArray(d) ? { ...d } : {}
}

/* -------- escaping -------- */

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
}

/**
 * Escape for markdown inline. The set of escaped chars matches exactly what
 * @lexical/markdown escapes on export, so md -> Lexical -> md stays byte-stable.
 */
function escapeInlineMd(s) {
	return String(s).replace(/[\\*_`~]/g, (c) => "\\" + c)
}

function pickFence(s) {
	if (!s) return "```"
	if (!/```/.test(s)) return "```"
	if (!/````/.test(s)) return "````"
	return "`````"
}

/* -------- marks (code = exclusive; GFM for bold/italic/strike; HTML for u) -------- */

/**
 * @param {string} rawText
 * @param {string[]} marks
 * @param {"md"|"html"} out
 */
function renderTextSegment(rawText, marks, out = "md") {
	const m = new Set(marks && marks.length ? marks : [])

	if (m.has("code")) {
		if (out === "html") {
			return "<code>" + escapeHtml(String(rawText)) + "</code>"
		}
		const t = String(rawText)
		if (!t.includes("`") && !t.includes("\n")) return "`" + t + "`"
		const fence = pickFence(t)
		return fence + t + fence
	}

	if (out === "html") {
		let t = escapeHtml(String(rawText))
		if (m.has("strikethrough")) t = "<s>" + t + "</s>"
		if (m.has("bold") && m.has("italic")) t = "<strong><em>" + t + "</em></strong>"
		else if (m.has("bold")) t = "<strong>" + t + "</strong>"
		else if (m.has("italic")) t = "<em>" + t + "</em>"
		return t
	}

	const escaped = escapeInlineMd(String(rawText))
	// CommonMark flanking rules: delimiters go inside the whitespace boundaries
	// (matches @lexical/markdown export; whitespace-only segments get no marks)
	const ws = escaped.match(/^(\s*)([\s\S]*?)(\s*)$/)
	const [, lead, core, trail] = ws
	if (core === "") return escaped

	let t = core
	if (m.has("strikethrough")) t = "~~" + t + "~~"
	if (m.has("bold") && m.has("italic")) t = "***" + t + "***"
	else if (m.has("bold")) t = "**" + t + "**"
	else if (m.has("italic")) t = "*" + t + "*"

	return lead + t + trail
}

/**
 * @param {any} node
 * @param {"md"|"html"} out
 */
function serializeInline(node, out = "md") {
	if (!node) return ""
	if (node.object === "text") {
		const parts = getTextParts(node)
		return parts
			.map((p) => renderTextSegment(p.text, p.marks, out))
			.join("")
	}

	if (node.object === "inline") {
		const d = getData(node.data)
		const inner = (node.nodes || [])
			.map((n) => serializeInline(n, out))
			.join("")

		if (node.type === "link" || node.type === "drive-link") {
			const href = d.href
			if (href == null || href === "")
				return inner
			if (out === "html")
				return '<a href="' + escapeHtml(String(href)) + '">' + inner + "</a>"
			return "[" + inner + "](" + String(href) + ")"
		}
		if (node.type === "drive-image") {
			const src = d.src != null ? String(d.src) : ""
			if (out === "html")
				return src
					? '<img src="' + escapeHtml(src) + '" alt="" />'
					: "<!-- drive-image: missing src -->"
			return src ? "![](" + src + ")" : "![ /* missing */ ]()"
		}
	}
	return ""
}

/**
 * @param {any[]|undefined} nodes
 * @param {"md"|"html"} [out]
 * @param {any} [opts]
 */
function serializeInlines(nodes, out = "md") {
	if (!nodes) return ""
	return nodes.map((n) => serializeInline(n, out)).join("")
}

/* -------- blocks -------- */

/**
 * @param {string} s
 */
function oneLineCell(s) {
	return s.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim()
}

/**
 * Flatten arbitrary cell content (paragraphs, lists, nested blocks)
 * into a single pipe-table-safe line.
 * @param {any} cell
 */
function cellToPipeText(cell) {
	const blocks = (cell.nodes || []).filter((n) => n.object === "block")
	if (!blocks.length) return oneLineCell(serializeInlines(cell.nodes || []))
	return blocks
		.map((b) => oneLineCell(serializeBlockInner(b, "", 0)))
		.filter((s) => s.length)
		.join(" ")
}

/**
 * Always emits a GFM pipe table; headless tables get an empty header row.
 * @param {any} table
 */
function serializeTablePipe(table) {
	const rows = (table.nodes || []).filter(
		(n) => n.object === "block" && n.type === "table_row",
	)
	if (!rows.length) return "\n"
	const headless = Boolean(getData(table.data).headless)
	const cellsPerRow = rows.map((row) =>
		(row.nodes || []).filter(
			(n) => n.object === "block" && n.type === "table_cell",
		),
	)
	const nCols = Math.max(1, ...cellsPerRow.map((cells) => cells.length))
	const rowLines = cellsPerRow.map(
		(cells) => "| " + cells.map(cellToPipeText).join(" | ") + " |",
	)
	const sep = "|" + " --- |".repeat(nCols)
	if (headless) {
		const emptyHeader = "|" + "  |".repeat(nCols)
		return [emptyHeader, sep, ...rowLines].join("\n") + "\n"
	}
	return [rowLines[0], sep, ...rowLines.slice(1)].join("\n") + "\n"
}

/**
 * @param {any} li
 * @param {string} linePrefix
 * @param {number} depth
 */
function serializeListItemMd(li, linePrefix, depth) {
	const nodes = li.nodes || []
	const head = []
	const blocks = []
	for (const n of nodes) {
		if (n.object === "text" || n.object === "inline") head.push(n)
		else if (n.object === "block") blocks.push(n)
	}
	// 4 spaces per level: @lexical/markdown's LIST_INDENT_SIZE
	const pad = "    ".repeat(depth)
	let s = pad + linePrefix
	if (head.length) s += serializeInlines(head) + "\n"
	else s += "\n"
	// GFM: nested block content in a list item is usually indented 4+ spaces
	const contPad = pad + "    "
	for (const b of blocks) {
		if (b.type === "bulleted-list" || b.type === "numbered-list") {
			s += serializeListAsMd(
				b,
				b.type === "numbered-list",
				depth + 1,
			)
		} else {
			const btxt = serializeBlockInner(b, "", depth).replace(/\n+$/, "")
			const lines = btxt.split("\n")
			if (lines.length) {
				s += contPad + lines[0] + "\n"
				for (let k = 1; k < lines.length; k++) s += contPad + lines[k] + "\n"
			}
		}
	}
	return s
}

/**
 * @param {any} listBlock
 * @param {boolean} ordered
 * @param {number} depth
 */
function serializeListAsMd(listBlock, ordered, depth) {
	const items = (listBlock.nodes || []).filter(
		(n) => n.object === "block" && n.type === "list-item",
	)
	let out = ""
	for (let i = 0; i < items.length; i++) {
		const pfx = (ordered ? i + 1 + "." : "-") + " "
		out += serializeListItemMd(items[i], pfx, depth)
	}
	return out
}

/**
 * @param {any} block
 * @param {string} baseIndent
 * @param {number} depth
 */
function serializeBlockInner(block, baseIndent, depth) {
	if (!block || block.object !== "block") return ""
	const t = block.type
	const d = getData(block.data)
	const ch = block.nodes || []

	if (t === "image") {
		const src = d.src != null ? String(d.src) : ""
		if (!src) return baseIndent + "![ /* missing src */ ]()\n"
		return baseIndent + "![](" + src + ")\n"
	}
	if (t && String(t).startsWith("heading-")) {
		const n = t.replace("heading-", "")
		const level = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }[n] || 1
		const hashes = "#".repeat(level)
		return baseIndent + hashes + " " + serializeInlines(ch) + "\n"
	}
	if (t === "paragraph")
		return baseIndent + serializeInlines(ch) + "\n"
	if (t === "block-quote") {
		const outLines = []
		for (const n of ch) {
			if (n.object === "text" || n.object === "inline") {
				const text = serializeInlines([n])
				for (const ln of text.split("\n")) outLines.push(baseIndent + "> " + ln)
			} else if (n.object === "block") {
				const b = serializeBlockInner(n, baseIndent, depth)
				const trimmed = b.replace(/\n+$/, "")
				for (const ln of trimmed.split("\n"))
					outLines.push(baseIndent + "> " + ln)
			}
		}
		return (outLines.length ? outLines.join("\n") + "\n" : baseIndent + ">\n")
	}
	if (t === "code") {
		const hasInline = ch.some((n) => n.object === "inline")
		if (hasInline) {
			let inner = ""
			for (const n of ch) {
				if (n.object === "text" || n.object === "inline")
					inner += serializeInline(n, "html")
			}
			return (
				baseIndent + '<pre><code class="language-' + escapeHtml(String(d.language || "")) + '">' + inner + "</code></pre>\n"
			)
		}
		const text = ch
			.filter((n) => n.object === "text")
			.flatMap((n) => getTextParts(n).map((p) => p.text))
			.join("")
		const fence = pickFence(text)
		const lang = d.language != null ? String(d.language) : ""
		return baseIndent + fence + lang + "\n" + text + "\n" + baseIndent + fence + "\n"
	}
	if (t === "table")
		return baseIndent + serializeTablePipe(block)
	if (t === "bulleted-list" || t === "numbered-list")
		return serializeListAsMd(block, t === "numbered-list", 0) || "\n"
	if (t === "check-list-item") {
		const checked = Boolean(d.checked)
		const prefix = checked ? "- [x] " : "- [ ] "
		return baseIndent + prefix + serializeInlines(ch) + "\n"
	}
	if (t === "list-item")
		return serializeListItemMd(block, "- ", depth) // fallback
	const inner = ch
		.map((n) => {
			if (n.object === "block") return serializeBlockInner(n, baseIndent, depth)
			if (n.object === "text" || n.object === "inline")
				return baseIndent + serializeInlines([n]) + "\n"
			return ""
		})
		.join("")
	return (
		"<!-- unknown-block: " +
		String(t) +
		" -->\n" +
		inner
	)
}

/**
 * @param {any} document
 * @param {{ allowEmpty: boolean }} [opts]
 */
export function documentToMarkdown(document, opts = { allowEmpty: true }) {
	const nodes = (document && document.nodes) || []
	if (!nodes.length) {
		return opts.allowEmpty ? "" : "\n"
	}
	return nodes
		.map((n) => {
			if (n.object === "block") return serializeBlockInner(n, "", 0).replace(/\n+$/, "")
			if (n.object === "text" || n.object === "inline")
				return serializeInlines([n])
			return ""
		})
		// drop whitespace-only blocks: markdown has no empty paragraphs
		.filter((s) => s.trim().length)
		.join("\n\n") + "\n"
}

/**
 * @param {string|any} gwikiOrJson
 */
export function slate0ValueToMarkdown(gwikiOrJson) {
	const doc = typeof gwikiOrJson === "string"
		? parseGwikiDocument(gwikiOrJson)
		: gwikiOrJson
	return documentToMarkdown(doc)
}
