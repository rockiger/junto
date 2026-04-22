import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import multimd from "markdown-it-multimd-table"

/**
 * Same options as a typical "rich" static pipeline; use for --validate.
 * @param {string} src
 * @returns {{ ok: true, html: string } | { ok: false, err: string }}
 */
export function validateWithMarkdownIt(src) {
	const md = new MarkdownIt("commonmark", {
		html: true,
		linkify: true,
		typographer: false,
		breaks: false,
	})
		.use(mdAnchor, { permalink: false })
		.use(multimd, { multiline: true, rowspan: true, headerless: true })
	try {
		const html = md.render(src)
		return { ok: true, html }
	} catch (err) {
		return { ok: false, err: String((err && err.message) || err) }
	}
}
