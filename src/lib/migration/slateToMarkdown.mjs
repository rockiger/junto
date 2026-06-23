/**
 * Browser entry point for the Slate 0.47 -> Markdown converter.
 * Single source of truth lives in scripts/lib/ (dependency-free, also used
 * by the offline CLI and the golden tests).
 */
export {
	documentToMarkdown,
	getData,
	getTextParts,
	parseGwikiDocument,
	slate0ValueToMarkdown,
} from "../../../scripts/lib/slate0.47ToMarkdown.mjs"
