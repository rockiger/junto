/**
 * Hard criterion of the Slate->Lexical migration: Markdown -> Lexical -> Markdown
 * must be byte-idempotent for all converted .gwiki samples, otherwise every
 * open+save would create a new Drive revision.
 */
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "bun:test"
import { createHeadlessEditor } from "@lexical/headless"
import {
	$exportWikiMarkdown,
	$importWikiMarkdown,
	WIKI_NODES,
} from "../src/components/Editor/lexical/markdown.js"
import { slate0ValueToMarkdown } from "./lib/slate0.47ToMarkdown.mjs"

const root = path.join(import.meta.dirname, "..", "slate_samples")

function roundTrip(markdown) {
	const editor = createHeadlessEditor({
		nodes: WIKI_NODES,
		onError: (err) => {
			throw err
		},
	})
	editor.update(() => $importWikiMarkdown(markdown), { discrete: true })
	let out = ""
	editor.read(() => {
		out = $exportWikiMarkdown()
	})
	return out
}

describe("Markdown -> Lexical -> Markdown round trip", () => {
	it("empty document", () => {
		expect(roundTrip("")).toBe("")
	})

	it("basic blocks are byte-idempotent", () => {
		const md = [
			"# H1",
			"",
			"Text with **bold**, *italic*, ~~strike~~, `code` and <u>underline</u>.",
			"",
			"> A quote",
			"",
			"- one",
			"- two",
			"    - nested",
			"",
			"1. first",
			"2. second",
			"",
			"- [x] done",
			"- [ ] open",
			"",
			"```js",
			"const x = 1",
			"```",
			"",
			"![](https://example.com/img.png)",
			"",
			"![alt](https://example.com/sized.png =300x200)",
			"",
			"[Link](https://example.com/)",
			"",
			"| H1 | H2 |",
			"| --- | --- |",
			"| a | b |",
			"",
			"|  |  |",
			"| --- | --- |",
			"| headless | table |",
			"",
		].join("\n")
		expect(roundTrip(md)).toBe(md)
	})

	it("column layouts are byte-idempotent", () => {
		const md = [
			"::: layout 1fr 1fr",
			"Left **bold**",
			":::column",
			"Right column",
			":::",
			"",
			"::: layout 3fr 1fr",
			"Wide",
			":::column",
			"Narrow",
			":::",
			"",
			"::: layout 1fr 1fr 1fr",
			"One",
			":::column",
			"Two",
			":::column",
			"Three",
			":::",
			"",
			"::: layout 1fr 2fr 1fr",
			"A",
			":::column",
			"B",
			":::column",
			"C",
			":::",
			"",
			"::: layout 1fr 1fr 1fr 1fr",
			"Q1",
			":::column",
			"Q2",
			":::column",
			"Q3",
			":::column",
			"Q4",
			":::",
			"",
		].join("\n")
		expect(roundTrip(md)).toBe(md)
	})

	it("excalidraw blocks are byte-idempotent", () => {
		const md = [
			"::: excalidraw meeting-notes-a1b2c3d4.excalidraw.json",
			":::",
			"",
			"Before",
			"",
			"::: excalidraw my-page-deadbeef.excalidraw.json",
			":::",
			"",
		].join("\n")
		expect(roundTrip(md)).toBe(md)
	})

	it("inserted excalidraw node serializes to markdown block", async () => {
		const { $createExcalidrawNode } = await import(
			"../src/components/Editor/lexical/nodes/ExcalidrawNode.tsx"
		)
		const { $insertNodeToNearestRoot } = await import("@lexical/utils")
		const { HISTORY_MERGE_TAG } = await import("lexical")
		const editor = createHeadlessEditor({
			nodes: WIKI_NODES,
			onError: (err) => {
				throw err
			},
		})
		editor.update(
			() => {
				$insertNodeToNearestRoot(
					$createExcalidrawNode({
						fileName: "meeting-notes-a1b2c3d4.excalidraw.json",
					}),
				)
			},
			{ discrete: true, tag: HISTORY_MERGE_TAG },
		)
		let out = ""
		editor.read(() => {
			out = $exportWikiMarkdown()
		})
		expect(out).toBe(
			"::: excalidraw meeting-notes-a1b2c3d4.excalidraw.json\n:::\n\n",
		)
	})

	it("all converted slate_samples are byte-idempotent", async () => {
		const files = (await readdir(root)).filter((f) =>
			f.toLowerCase().endsWith(".gwiki"),
		)
		expect(files.length).toBeGreaterThan(0)
		for (const file of files) {
			const raw = await readFile(path.join(root, file), "utf8")
			const md = slate0ValueToMarkdown(raw)
			const once = roundTrip(md)
			expect(once).toBe(md)
			// stability of the round trip itself
			expect(roundTrip(once)).toBe(once)
		}
	})
})
