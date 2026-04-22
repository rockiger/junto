import { readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "bun:test"
import {
	documentToMarkdown,
	slate0ValueToMarkdown,
	getTextParts,
} from "./lib/slate0.47ToMarkdown.mjs"
import { validateWithMarkdownIt } from "./validateWithMarkdownIt.mjs"

const root = path.join(import.meta.dirname, "..", "slate_samples")

function sample(name) {
	return readFile(path.join(root, name), "utf8")
}

describe("Slate 0.47 → Markdown", () => {
	it("leaves: text in leaves[]", () => {
		const j = { object: "text", leaves: [{ text: "x", marks: [] }] }
		expect(getTextParts(j)).toEqual([{ text: "x", marks: [] }])
	})

	it("Button Test: GFM and validation", async () => {
		const raw = await sample("Button Test.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("# Headline 1")
		expect(md).toContain("```js")
		expect(md).toContain("| TH 1 |")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("Personas: images and http links", async () => {
		const raw = await sample("Personas.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("![](")
		expect(md).toContain("https://maconraine.com/")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("Find Paste: headless table → HTML and nested lists", async () => {
		const raw = await sample("Find Paste Bug.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("<table>")
		expect(md).toContain("<ol>")
		expect(md).toContain("How To Design Functions (HtDF)")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("Picker Test: drive-link comments", async () => {
		const raw = await sample("Picker Test.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("<!-- drive")
		expect(md).toContain("Entrepreneurship.gwiki")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("Insert Images: code block with inline + images", async () => {
		const raw = await sample("Insert Images from Picker.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("<pre><code")
		expect(md).toContain("drive.google.com")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("empty document: empty string", () => {
		expect(documentToMarkdown({ object: "document", nodes: [] })).toBe(
			"",
		)
	})
})
