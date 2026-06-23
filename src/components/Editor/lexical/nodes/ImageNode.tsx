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
import { lazy, Suspense, type JSX } from 'react'

const ImageComponent = lazy(() => import('./ImageComponent'))

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
	if (domNode instanceof HTMLImageElement) {
		const { src, alt, width, height } = domNode
		return {
			node: $createImageNode({
				altText: alt,
				height: height > 0 ? height : 'inherit',
				src,
				width: width > 0 ? width : 'inherit',
			}),
		}
	}
	return null
}

export type SerializedImageNode = Spread<
	{
		altText: string
		height?: number
		src: string
		width?: number
	},
	SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string
	__altText: string
	__width: 'inherit' | number
	__height: 'inherit' | number

	static getType(): string {
		return 'image'
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(
			node.__src,
			node.__altText,
			node.__width,
			node.__height,
			node.__key,
		)
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		const { altText, height, src, width } = serializedNode
		return $createImageNode({
			altText,
			height: height ?? 'inherit',
			src,
			width: width ?? 'inherit',
		}).updateFromJSON(serializedNode)
	}

	static importDOM(): DOMConversionMap | null {
		return {
			img: () => ({
				conversion: $convertImageElement,
				priority: 0,
			}),
		}
	}

	constructor(
		src: string,
		altText = '',
		width: 'inherit' | number = 'inherit',
		height: 'inherit' | number = 'inherit',
		key?: NodeKey,
	) {
		super(key)
		this.__src = src
		this.__altText = altText
		this.__width = width
		this.__height = height
	}

	exportJSON(): SerializedImageNode {
		const serialized: SerializedImageNode = {
			...super.exportJSON(),
			altText: this.__altText,
			src: this.__src,
		}
		if (this.__width !== 'inherit') {
			serialized.width = this.__width
		}
		if (this.__height !== 'inherit') {
			serialized.height = this.__height
		}
		return serialized
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('img')
		element.setAttribute('src', this.__src)
		element.setAttribute('alt', this.__altText)
		if (this.__width !== 'inherit') {
			element.setAttribute('width', String(this.__width))
		}
		if (this.__height !== 'inherit') {
			element.setAttribute('height', String(this.__height))
		}
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

	getWidth(): 'inherit' | number {
		return this.__width
	}

	getHeight(): 'inherit' | number {
		return this.__height
	}

	setWidthAndHeight(
		width: 'inherit' | number,
		height: 'inherit' | number,
	): void {
		const writable = this.getWritable()
		writable.__width = width
		writable.__height = height
	}

	decorate(): JSX.Element {
		return (
			<Suspense fallback={null}>
				<ImageComponent
					src={this.__src}
					altText={this.__altText}
					nodeKey={this.getKey()}
					width={this.__width}
					height={this.__height}
				/>
			</Suspense>
		)
	}
}

export function $createImageNode({
	altText = '',
	height = 'inherit',
	key,
	src = '',
	width = 'inherit',
}: {
	altText?: string
	height?: 'inherit' | number
	key?: NodeKey
	src?: string
	width?: 'inherit' | number
} = {}): ImageNode {
	return $applyNodeReplacement(
		new ImageNode(src, altText, width, height, key),
	)
}

export function $isImageNode(
	node: LexicalNode | null | undefined,
): node is ImageNode {
	return node instanceof ImageNode
}
