import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	$createParagraphNode,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	type LexicalCommand,
} from 'lexical'
import { useEffect } from 'react'
import { getLayoutColumnCount } from '../layoutPresets'
import {
	$createLayoutContainerNode,
	$isLayoutContainerNode,
	LayoutContainerNode,
} from '../nodes/LayoutContainerNode'
import {
	$createLayoutItemNode,
	$isLayoutItemNode,
	LayoutItemNode,
} from '../nodes/LayoutItemNode'

export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> =
	createCommand('INSERT_LAYOUT_COMMAND')

const $fillLayoutItemIfEmpty = (node: LayoutItemNode) => {
	if (node.isEmpty()) {
		node.append($createParagraphNode())
	}
}

const $removeIsolatedLayoutItem = (node: LayoutItemNode): boolean => {
	const parent = node.getParent()
	if (!$isLayoutContainerNode(parent)) {
		for (const child of node.getChildren()) {
			node.insertBefore(child)
		}
		node.remove()
		return true
	}
	return false
}

export default function LayoutPlugin() {
	const [editor] = useLexicalComposerContext()

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				INSERT_LAYOUT_COMMAND,
				(template) => {
					editor.update(() => {
						const container = $createLayoutContainerNode(template)
						const itemsCount = getLayoutColumnCount(template)

						for (let i = 0; i < itemsCount; i++) {
							container.append(
								$createLayoutItemNode().append($createParagraphNode()),
							)
						}

						$insertNodeToNearestRoot(container)
						container.selectStart()
					})
					return true
				},
				COMMAND_PRIORITY_EDITOR,
			),
			editor.registerNodeTransform(LayoutItemNode, (node) => {
				if (!$removeIsolatedLayoutItem(node)) {
					$fillLayoutItemIfEmpty(node)
				}
			}),
			editor.registerNodeTransform(LayoutContainerNode, (node) => {
				const children = node.getChildren()
				if (!children.every($isLayoutItemNode)) {
					for (const child of children) {
						node.insertBefore(child)
					}
					node.remove()
				}
			}),
		)
	}, [editor])

	return null
}
