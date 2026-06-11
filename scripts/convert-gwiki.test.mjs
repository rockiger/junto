import { readdir, readFile } from "node:fs/promises"
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

	it("check-list-item: GFM task list", async () => {
		const raw = await readFile(
			path.join(import.meta.dirname, "fixtures", "checkListValue.json"),
			"utf8",
		)
		const md = slate0ValueToMarkdown(raw)
		expect(md).toContain("- [x] Slide to the left.")
		expect(md).toContain("- [x] Slide to the right.")
		expect(md).toContain("- [ ] Criss-cross.")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
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

	it("Find Paste: headless table → pipe table with empty header", async () => {
		const raw = await sample("Find Paste Bug.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).not.toContain("<table>")
		expect(md).toContain("|  |\n| --- |\n|")
		expect(md).toContain("How To Design Functions (HtDF)")
		const v = validateWithMarkdownIt(md)
		expect(v.ok).toBe(true)
	})

	it("Picker Test: drive-link as plain markdown link", async () => {
		const raw = await sample("Picker Test.gwiki")
		const md = slate0ValueToMarkdown(raw)
		expect(md).not.toContain("<!-- drive")
		expect(md).toContain("[Entrepreneurship](https://drive.google.com/file/d/")
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

	it("golden snapshots for all slate_samples", async () => {
		const files = (await readdir(root)).filter((f) =>
			f.toLowerCase().endsWith(".gwiki"),
		)
		expect(files.length).toBeGreaterThan(0)
		for (const file of files) {
			const raw = await sample(file)
			const md = slate0ValueToMarkdown(raw)
			expect(md).toMatchSnapshot(file)
			const v = validateWithMarkdownIt(md)
			expect(v.ok).toBe(true)
		}
	})
})
