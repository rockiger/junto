/**
 * Recursively convert Junto `.gwiki` (Slate 0.47 JSON) files to `.md`.
 *
 * Options:
 *   --root <dir>     Source root (default: .)
 *   --out <dir>      Output root (default: out-md next to --root, or .)
 *   --dry-run        List targets without writing
 *   --verbose        Log per file
 *   --no-validate    Skip markdown-it parse/validate pass
 *   --no-overwrite   Skip if destination .md already exists
 *   --allow-empty    Write even when document is empty (default: still write 0-length or newline)
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"
import { slate0ValueToMarkdown, parseGwikiDocument } from "./lib/slate0.47ToMarkdown.mjs"
import { validateWithMarkdownIt } from "./validateWithMarkdownIt.mjs"

function parseArgs(argv) {
	const out = {
		root: process.cwd(),
		outDir: null,
		dryRun: false,
		verbose: false,
		validate: true,
		overwrite: true,
	}
	for (let i = 2; i < argv.length; i++) {
		const a = argv[i]
		if (a === "--dry-run") out.dryRun = true
		else if (a === "--verbose") out.verbose = true
		else if (a === "--no-validate") out.validate = false
		else if (a === "--no-overwrite") out.overwrite = false
		else if (a === "--root" && argv[i + 1]) {
			i++
			out.root = path.resolve(argv[i])
		} else if (a === "--out" && argv[i + 1]) {
			i++
			out.outDir = path.resolve(argv[i])
		} else if (a === "--help" || a === "-h") {
			return { help: true }
		} else
			return { err: "Unknown or incomplete arg: " + a }
	}
	if (!out.outDir) {
		out.outDir = path.join(out.root, "out-md")
	}
	return { opts: out }
}

async function* walkGwikiFiles(dir) {
	const { readdir } = await import("node:fs/promises")
	const entries = await readdir(dir, { withFileTypes: true })
	for (const e of entries) {
		const p = path.join(dir, e.name)
		if (e.isDirectory()) yield* walkGwikiFiles(p)
		else if (e.isFile() && e.name.toLowerCase().endsWith(".gwiki")) yield p
	}
}

async function fileExists(p) {
	try {
		await access(p, fsConstants.F_OK)
		return true
	} catch {
		return false
	}
}

async function main() {
	const parsed = parseArgs(process.argv)
	if (parsed.help) {
		console.log(`
  bun run scripts/convert-gwiki-to-md.mjs [options]
  --root <dir>     Source (default: cwd)
  --out <dir>      Output (default: <root>/out-md)
  --dry-run
  --verbose
  --no-validate
  --no-overwrite
`)
		process.exit(0)
	}
	if (parsed.err) {
		console.error(parsed.err)
		process.exit(1)
	}
	const { opts } = parsed
	let fail = 0
	let n = 0
	for await (const gwiki of walkGwikiFiles(opts.root)) {
		const rel = path.relative(opts.root, gwiki)
		const mdRel = rel.replace(/\.gwiki$/i, ".md")
		const outPath = path.join(opts.outDir, mdRel)
		n++
		try {
			const raw = await readFile(gwiki, "utf8")
			// quick parse
			parseGwikiDocument(raw)
			const md = slate0ValueToMarkdown(raw)
			if (opts.validate) {
				const v = validateWithMarkdownIt(md)
				if (!v.ok) {
					console.error("validate failed:", gwiki, v.err)
					fail++
					continue
				}
			}
			if (!opts.overwrite && (await fileExists(outPath))) {
				if (opts.verbose) console.log("skip (exists):", outPath)
				continue
			}
			if (opts.dryRun) {
				if (opts.verbose) console.log(gwiki, "->", outPath)
				else console.log(outPath)
				continue
			}
			await mkdir(path.dirname(outPath), { recursive: true })
			await writeFile(outPath, md, "utf8")
			if (opts.verbose) console.log("wrote", outPath)
		} catch (e) {
			console.error("error:", gwiki, (e && e.message) || e)
			fail++
		}
	}
	if (n === 0) console.error("no .gwiki files under", opts.root)
	process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
