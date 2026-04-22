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

/** Escape for markdown inline (avoid emphasis / link confusion) */
function escapeInlineMd(s) {
	// do not escape ( ) or . — not needed in middle of line (CommonMark)
	return String(s).replace(/[\\*_\[\]`]/g, (c) => "\\" + c)
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
		if (m.has("underline")) t = "<u>" + t + "</u>"
		return t
	}

	let t = escapeInlineMd(String(rawText))
	if (m.has("strikethrough")) t = "~~" + t + "~~"
	if (m.has("bold") && m.has("italic")) t = "***" + t + "***"
	else if (m.has("bold")) t = "**" + t + "**"
	else if (m.has("italic")) t = "_" + t + "_"
	if (m.has("underline")) t = "<u>" + t + "</u>"

	return t
}

/**
 * @param {any} node
 * @param {"md"|"html"} out
 * @param {{ driveLinkMeta: "comment"|"none" }} [opts]
 */
function serializeInline(node, out = "md", opts = { driveLinkMeta: "comment" }) {
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
			.map((n) => serializeInline(n, out, opts))
			.join("")

		if (node.type === "link") {
			const href = d.href
			if (href == null || href === "")
				return inner + (out === "md" && opts.driveLinkMeta !== "none" ? " <!-- link: missing href -->" : "")
			if (out === "html")
				return '<a href="' + escapeHtml(String(href)) + '">' + inner + "</a>"
			// title optional
			return "[" + inner + "](" + String(href) + ")"
		}
		if (node.type === "drive-link") {
			const href = d.href != null ? String(d.href) : ""
			const line = href
				? out === "html"
					? '<a href="' + escapeHtml(href) + '">' + inner + "</a>"
					: "[" + inner + "](" + href + ")"
				: inner + (out === "md" ? " <!-- drive-link: missing href -->" : "")
			const extra = []
			if (d.id) extra.push("id=" + d.id)
			if (d.name) extra.push("name=" + String(d.name).slice(0, 200))
			if (d.internal != null) extra.push("internal=" + d.internal)
			if (d.iconUrl) extra.push("iconUrl=" + String(d.iconUrl).slice(0, 200))
			if (d.target) extra.push("target=" + d.target)
			if (out === "md" && opts.driveLinkMeta === "comment" && extra.length) {
				return line + " " + "<!-- drive " + extra.join(" ") + " -->"
			}
			return line
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
function serializeInlines(nodes, out = "md", opts) {
	if (!nodes) return ""
	return nodes.map((n) => serializeInline(n, out, opts)).join("")
}

/* -------- blocks -------- */

/**
 * @param {any} cell
 * @param {any} [tableData]
 */
function isSimpleCellForPipe(cell) {
	if (!cell || cell.type !== "table_cell") return true
	const blocks = (cell.nodes || []).filter((n) => n.object === "block")
	if (blocks.length === 0) return true
	if (blocks.length > 1) return false
	const b0 = blocks[0]
	if (b0.type === "paragraph" || String(b0.type || "").startsWith("heading-")) return true
	return false
}

/**
 * @param {any} table
 */
function tableIsPipeFriendly(table) {
	const d = getData(table.data)
	if (d.headless) return false
	const rows = (table.nodes || []).filter(
		(n) => n.object === "block" && n.type === "table_row",
	)
	for (const row of rows) {
		for (const cell of row.nodes || []) {
			if (!isSimpleCellForPipe(cell)) return false
		}
	}
	return true
}

/**
 * @param {string} s
 */
function oneLineCell(s) {
	return s.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim()
}

/**
 * @param {any} table
 * @param {string} _indent
 */
function serializeTablePipe(table, _indent) {
	const rows = (table.nodes || []).filter(
		(n) => n.object === "block" && n.type === "table_row",
	)
	if (!rows.length) return "\n"
	const lines = []
	for (const row of rows) {
		const cells = (row.nodes || []).filter(
			(n) => n.object === "block" && n.type === "table_cell",
		)
		const parts = cells.map((cell) => {
			const b = (cell.nodes || [])[0]
			if (!b) return ""
			if (b.type === "paragraph" || String(b.type).startsWith("heading-")) {
				return oneLineCell(serializeInlines(b.nodes || []))
			}
			return ""
		})
		lines.push("| " + parts.join(" | ") + " |")
	}
	if (lines.length) {
		const nCols = Math.max(1, lines[0].split("|").length - 2)
		const sep = "|" + " --- |".repeat(nCols)
		return [lines[0], sep, ...lines.slice(1)].join("\n") + "\n"
	}
	return "\n"
}

/**
 * @param {any} block
 * @param {"md"|"html"} out
 */
function blockToCellHtmlFragment(block) {
	if (!block || block.object !== "block") return ""
	const d = getData(block.data)
	const children = block.nodes || []
	const t = block.type

	if (t === "paragraph")
		return "<p>" + serializeInlines(children, "html") + "</p>\n"
	if (t && String(t).startsWith("heading-")) {
		const n = t.replace("heading-", "")
		const level = ["one", "two", "three", "four", "five", "six"].indexOf(n) + 1
		const L = level > 0 ? level : 1
		return "<h" + L + ">" + serializeInlines(children, "html") + "</h" + L + ">\n"
	}
	if (t === "code") {
		const hasInline = children.some(
			(n) => n.object === "inline",
		)
		if (hasInline) {
			let inner = ""
			for (const n of children) {
				if (n.object === "text" || n.object === "inline")
					inner += serializeInline(n, "html")
			}
			return (
				'<pre><code class="language-' + escapeHtml(String(d.language || "")) + '">' + inner + "</code></pre>\n"
			)
		}
		const text = (children || [])
			.filter((n) => n.object === "text")
			.flatMap((n) => getTextParts(n).map((p) => p.text))
			.join("")
		return (
			'<pre><code class="language-' + escapeHtml(String(d.language || "")) + '">' + escapeHtml(text) + "</code></pre>\n"
		)
	}
	if (t === "block-quote")
		return (
			"<blockquote>\n" +
			children.map((b) => blockToCellHtmlFragment(b)).join("") +
			"</blockquote>\n"
		)
	if (t === "bulleted-list" || t === "numbered-list") {
		const tag = t === "bulleted-list" ? "ul" : "ol"
		const lis = (children || [])
			.filter((n) => n.object === "block" && n.type === "list-item")
			.map((li) => {
				return "<li>\n" + listItemToHtml(li) + "</li>\n"
			})
		return "<" + tag + ">\n" + lis.join("") + "</" + tag + ">\n"
	}
	if (t === "list-item")
		return listItemToHtml(block)
	if (t === "image") {
		const src = d.src != null ? String(d.src) : ""
		if (!src) return "<!-- image: missing src -->\n"
		return '<p><img src="' + escapeHtml(src) + '" alt="" /></p>\n'
	}
	if (t === "table")
		return serializeTableHtmlForEmbed(block, "")
	return (
		"<!-- cell-unknown: " + escapeHtml(String(t)) + " -->\n" + serializeInlines(children, "html")
	)
}

/**
 * @param {any} li
 */
function listItemToHtml(li) {
	const nodes = li.nodes || []
	const head = []
	const blocks = []
	for (const n of nodes) {
		if (n.object === "text" || n.object === "inline") head.push(n)
		else if (n.object === "block") blocks.push(n)
	}
	let s = ""
	if (head.length) s += "<p>" + serializeInlines(head, "html") + "</p>\n"
	for (const b of blocks) s += blockToCellHtmlFragment(b)
	return s
}

/**
 * @param {any} table
 * @param {string} _ind
 */
function serializeTableHtmlForEmbed(table, _ind) {
	const rows = (table.nodes || []).filter(
		(n) => n.object === "block" && n.type === "table_row",
	)
	if (!rows.length) return "<table><tbody></tbody></table>\n"
	const d = getData(table.data)
	const headless = Boolean(d.headless)
	let h = "<table>\n"
	if (!headless && rows.length) {
		const first = rows[0]
		h += "<thead><tr>\n"
		for (const cell of first.nodes || []) {
			if (cell.type === "table_cell")
				h +=
					"<th>" + cellInnerHtml(cell) + "</th>\n"
		}
		h += "</tr></thead>\n"
	}
	h += "<tbody>\n"
	const bodyRows = headless ? rows : rows.slice(1)
	for (const row of bodyRows) {
		h += "<tr>\n"
		for (const cell of row.nodes || []) {
			if (cell.type === "table_cell")
				h += "<td>" + cellInnerHtml(cell) + "</td>\n"
		}
		h += "</tr>\n"
	}
	h += "</tbody></table>\n"
	return h
}

/**
 * @param {any} cell
 */
function cellInnerHtml(cell) {
	const blocks = (cell.nodes || []).filter((n) => n.object === "block")
	if (!blocks.length) return ""
	return blocks.map((b) => blockToCellHtmlFragment(b)).join("")
}

/**
 * @param {any} table
 * @param {string} _indent
 */
function serializeTableHtml(table, _indent) {
	return serializeTableHtmlForEmbed(table, _indent) + "\n"
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
	const pad = "  ".repeat(depth)
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
					inner += serializeInline(n, "html", { driveLinkMeta: "comment" })
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
		return tableIsPipeFriendly(block)
			? baseIndent + serializeTablePipe(block, baseIndent)
			: baseIndent + serializeTableHtml(block, baseIndent)
	if (t === "bulleted-list" || t === "numbered-list")
		return serializeListAsMd(block, t === "numbered-list", 0) || "\n"
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
		.filter((s) => s.length)
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
