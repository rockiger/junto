/**
 * Markdown dialect of the wiki (GFM + <u> underline), aligned with
 * scripts/lib/slate0.47ToMarkdown.mjs. Markdown -> Lexical -> Markdown
 * must be byte-idempotent (see scripts/lexical-roundtrip.test.mjs).
 */
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'
import {
    $createTableCellNode,
    $createTableNode,
    $createTableRowNode,
    $isTableCellNode,
    $isTableNode,
    $isTableRowNode,
    TableCellHeaderStates,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table'
import { $isParagraphNode, $isTextNode } from 'lexical'
import { $createImageNode, $isImageNode, ImageNode } from './nodes/ImageNode'

export const IMAGE = {
    dependencies: [ImageNode],
    export: node => {
        if (!$isImageNode(node)) return null
        return `![${node.getAltText()}](${node.getSrc()})`
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match
        const imageNode = $createImageNode({ altText, src })
        textNode.replace(imageNode)
    },
    trigger: ')',
    type: 'text-match',
}

export const UNDERLINE = {
    dependencies: [],
    export: (node, exportChildren, exportFormat) => {
        if (!$isTextNode(node) || !node.hasFormat('underline')) return null
        return '<u>' + exportFormat(node, node.getTextContent()) + '</u>'
    },
    importRegExp: /<u>(.*?)<\/u>/,
    regExp: /<u>(.*?)<\/u>$/,
    replace: (textNode, match) => {
        textNode.setTextContent(match[1])
        textNode.toggleFormat('underline')
        return textNode
    },
    type: 'text-match',
}

/* -------- Table (port of the Lexical playground TABLE transformer) -------- */

const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/
// Requires at least one hyphen per cell so empty header rows (`|  |  |`,
// used for headless tables) are not mistaken for divider rows.
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-+:? ?)+\|\s?$/

function getTableColumnsSize(table) {
    const row = table.getFirstChild()
    return $isTableRowNode(row) ? row.getChildrenSize() : 0
}

function createTableCell(textContent) {
    const normalized = textContent.replace(/\\n/g, '\n').trim()
    const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
    $convertFromMarkdownString(normalized, WIKI_TRANSFORMERS, cell)
    return cell
}

function mapToTableCells(textContent) {
    const match = textContent.match(TABLE_ROW_REG_EXP)
    if (!match || !match[1]) return null
    return match[1].split('|').map(text => createTableCell(text))
}

export const TABLE = {
    dependencies: [TableNode, TableRowNode, TableCellNode],
    export: node => {
        if (!$isTableNode(node)) return null

        const output = []
        for (const row of node.getChildren()) {
            const rowOutput = []
            if (!$isTableRowNode(row)) continue

            let isHeaderRow = false
            for (const cell of row.getChildren()) {
                if ($isTableCellNode(cell)) {
                    rowOutput.push(
                        $convertToMarkdownString(
                            WIKI_TRANSFORMERS,
                            cell
                        ).replace(/\n/g, '\\n')
                    )
                    if (cell.__headerState === TableCellHeaderStates.ROW) {
                        isHeaderRow = true
                    }
                }
            }

            output.push(`| ${rowOutput.join(' | ')} |`)
            if (isHeaderRow) {
                output.push(`| ${rowOutput.map(() => '---').join(' | ')} |`)
            }
        }

        return output.join('\n')
    },
    regExp: TABLE_ROW_REG_EXP,
    replace: (parentNode, _children, match, isImport) => {
        // Header row separator: mark previous row cells as header
        if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
            const table = parentNode.getPreviousSibling()
            if (!table || !$isTableNode(table)) return

            const rows = table.getChildren()
            const lastRow = rows[rows.length - 1]
            if (!lastRow || !$isTableRowNode(lastRow)) return

            lastRow.getChildren().forEach(cell => {
                if (!$isTableCellNode(cell)) return
                cell.setHeaderStyles(
                    TableCellHeaderStates.ROW,
                    TableCellHeaderStates.ROW
                )
            })

            parentNode.remove()
            return
        }

        const matchCells = mapToTableCells(match[0])
        if (matchCells == null) return

        const rows = [matchCells]
        let sibling = parentNode.getPreviousSibling()
        let maxCells = matchCells.length

        // Glue preceding paragraph lines that also look like table rows
        while (sibling) {
            if (!$isParagraphNode(sibling)) break
            if (sibling.getChildrenSize() !== 1) break

            const firstChild = sibling.getFirstChild()
            if (!$isTextNode(firstChild)) break

            const cells = mapToTableCells(firstChild.getTextContent())
            if (cells == null) break

            maxCells = Math.max(maxCells, cells.length)
            rows.unshift(cells)
            const previousSibling = sibling.getPreviousSibling()
            sibling.remove()
            sibling = previousSibling
        }

        const table = $createTableNode()
        for (const cells of rows) {
            const tableRow = $createTableRowNode()
            table.append(tableRow)
            for (let i = 0; i < maxCells; i++) {
                tableRow.append(i < cells.length ? cells[i] : createTableCell(''))
            }
        }

        const previousSibling = parentNode.getPreviousSibling()
        if (
            $isTableNode(previousSibling) &&
            getTableColumnsSize(previousSibling) === maxCells
        ) {
            previousSibling.append(...table.getChildren())
            parentNode.remove()
        } else {
            parentNode.replace(table)
        }

        if (!isImport) {
            table.selectEnd()
        }
    },
    type: 'element',
}

export const WIKI_TRANSFORMERS = [
    TABLE,
    IMAGE,
    UNDERLINE,
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...MULTILINE_ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
]
