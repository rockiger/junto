import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import clsx from 'clsx'
import {
	$applyNodeReplacement,
	DecoratorNode,
	type DOMConversionMap,
	type DOMConversionOutput,
	type DOMExportOutput,
	type EditorConfig,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode,
	type Spread,
} from 'lexical'
import { downloadFileBlob, parseDriveImageFileId } from 'lib/gdrive'
import { useEffect, useState, type JSX } from 'react'

interface ImageComponentProps {
	altText: string
	nodeKey: NodeKey
	src: string
}

function ImageComponent({ src, altText, nodeKey }: ImageComponentProps) {
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey)
	const driveFileId = parseDriveImageFileId(src)
	const [displaySrc, setDisplaySrc] = useState<string | null>(
		driveFileId ? null : src,
	)
	const [loading, setLoading] = useState(true)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		if (!driveFileId) {
			setDisplaySrc(src)
			setFailed(false)
			setLoading(true)
			return
		}

		let objectUrl: string | null = null
		let cancelled = false
		setDisplaySrc(null)
		setFailed(false)
		setLoading(true)

		downloadFileBlob(driveFileId)
			.then((blob) => {
				if (cancelled) return
				objectUrl = URL.createObjectURL(blob)
				setDisplaySrc(objectUrl)
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})

		return () => {
			cancelled = true
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [src, driveFileId])

	if (failed) {
		return (
			<span className="text-fg-muted italic">
				{altText || 'Image failed to load'}
			</span>
		)
	}

	return (
		<>
			{loading && (
				<div
					aria-hidden
					className="h-40 w-[20em] max-w-full animate-pulse rounded-sm bg-surface-selected"
				/>
			)}
			{displaySrc && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: Lexical node selection via click
				<img
					src={displaySrc}
					alt={altText}
					draggable={false}
					onClick={(event) => {
						if (!event.shiftKey) clearSelection()
						setSelected(!isSelected)
					}}
					onError={() => setFailed(true)}
					onLoad={() => setLoading(false)}
					className={clsx(
						'max-h-[20em] max-w-full',
						loading ? 'hidden' : 'block',
						isSelected && 'ring-1 ring-accent',
					)}
				/>
			)}
		</>
	)
}

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
	if (domNode instanceof HTMLImageElement) {
		const { src, alt } = domNode
		return { node: $createImageNode({ altText: alt, src }) }
	}
	return null
}

export type SerializedImageNode = Spread<
	{
		altText: string
		src: string
	},
	SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<JSX.Element> {
	static getType(): string {
		return 'image'
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(node.__src, node.__altText, node.__key)
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		const { src, altText } = serializedNode
		return $createImageNode({ altText, src }).updateFromJSON(serializedNode)
	}

	static importDOM(): DOMConversionMap | null {
		return {
			img: () => ({
				conversion: $convertImageElement,
				priority: 0,
			}),
		}
	}

	__src: string
	__altText: string

	constructor(src: string, altText = '', key?: NodeKey) {
		super(key)
		this.__src = src
		this.__altText = altText
	}

	exportJSON(): SerializedImageNode {
		return {
			...super.exportJSON(),
			altText: this.__altText,
			src: this.__src,
		}
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('img')
		element.setAttribute('src', this.__src)
		element.setAttribute('alt', this.__altText)
		return { element }
	}

	createDOM(config: EditorConfig): HTMLElement {
		const span = document.createElement('span')
		const className = config.theme.image
		if (className !== undefined) {
			span.className = className
		}
		return span
	}

	updateDOM(): false {
		return false
	}

	getSrc(): string {
		return this.__src
	}

	getAltText(): string {
		return this.__altText
	}

	decorate(): JSX.Element {
		return (
			<ImageComponent
				src={this.__src}
				altText={this.__altText}
				nodeKey={this.getKey()}
			/>
		)
	}
}

export function $createImageNode({
	src = '',
	altText = '',
	key,
}: {
	altText?: string
	key?: NodeKey
	src?: string
} = {}): ImageNode {
	return $applyNodeReplacement(new ImageNode(src, altText, key))
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
	return node instanceof ImageNode
}
