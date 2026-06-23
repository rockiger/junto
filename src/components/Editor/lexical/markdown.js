import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { WikiLinkNode, $createWikiLinkNode } from './nodes/WikiLinkNode'
import { ListItemNode, ListNode } from '@lexical/list'
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
} from '@lexical/markdown'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ImageNode } from './nodes/ImageNode'
import { ExcalidrawNode } from './nodes/ExcalidrawNode'
import { LayoutContainerNode } from './nodes/LayoutContainerNode'
import { LayoutItemNode } from './nodes/LayoutItemNode'
import { WIKI_TRANSFORMERS } from './transformers'

/** All nodes the wiki editor (and headless conversions) need. */
export const WIKI_NODES = [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    WikiLinkNode,
    {
        replace: LinkNode,
        with: node =>
            $createWikiLinkNode(node.getURL(), {
                rel: node.getRel(),
                target: node.getTarget(),
                title: node.getTitle(),
            }),
        withKlass: WikiLinkNode,
    },
    AutoLinkNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    ImageNode,
    ExcalidrawNode,
    LayoutContainerNode,
    LayoutItemNode,
]

/** Must run inside editor.update() */
export function $importWikiMarkdown(markdown) {
    $convertFromMarkdownString(markdown ?? '', WIKI_TRANSFORMERS)
}

/**
 * Must run inside editor.read()/update().
 * Stored .md files always end with a trailing newline (except empty docs),
 * matching the output of the gwiki converter.
 */
export function $exportWikiMarkdown() {
    const markdown = $convertToMarkdownString(WIKI_TRANSFORMERS)
    return markdown.length ? markdown + '\n' : ''
}
