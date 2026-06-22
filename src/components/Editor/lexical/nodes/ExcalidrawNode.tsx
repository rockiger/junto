import {
	$applyNodeReplacement,
	DecoratorNode,
	type DOMExportOutput,
	type EditorConfig,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode,
	type Spread,
} from 'lexical'
import { lazy, Suspense, type JSX } from 'react'

const ExcalidrawComponent = lazy(() => import('./ExcalidrawComponent'))

export const DEFAULT_EXCALIDRAW_WIDTH = 500
export const DEFAULT_EXCALIDRAW_HEIGHT = 400
export const DEFAULT_EXCALIDRAW_MAX_WIDTH = 800

export type SerializedExcalidrawNode = Spread<
	{
		driveFileId?: string
		fileName: string
		height?: number
		maxWidth: number
		sceneJson?: string
		width?: number
	},
	SerializedLexicalNode
>

export class ExcalidrawNode extends DecoratorNode<JSX.Element> {
	__fileName: string
	__driveFileId: string | null
	__sceneJson: string | null
	__width: 'inherit' | number
	__height: 'inherit' | number
	__maxWidth: number

	static getType(): string {
		return 'excalidraw'
	}

	static clone(node: ExcalidrawNode): ExcalidrawNode {
		return new ExcalidrawNode(
			node.__fileName,
			node.__driveFileId,
			node.__sceneJson,
			node.__width,
			node.__height,
			node.__maxWidth,
			node.__key,
		)
	}

	static importJSON(
		serializedNode: SerializedExcalidrawNode,
	): ExcalidrawNode {
		const { driveFileId, fileName, height, maxWidth, sceneJson, width } =
			serializedNode
		return $createExcalidrawNode({
			driveFileId: driveFileId ?? null,
			fileName,
			height: height ?? DEFAULT_EXCALIDRAW_HEIGHT,
			maxWidth: maxWidth ?? DEFAULT_EXCALIDRAW_MAX_WIDTH,
			sceneJson: sceneJson ?? null,
			width: width ?? DEFAULT_EXCALIDRAW_WIDTH,
		}).updateFromJSON(serializedNode)
	}

	constructor(
		fileName: string,
		driveFileId: string | null = null,
		sceneJson: string | null = null,
		width: 'inherit' | number = DEFAULT_EXCALIDRAW_WIDTH,
		height: 'inherit' | number = DEFAULT_EXCALIDRAW_HEIGHT,
		maxWidth = DEFAULT_EXCALIDRAW_MAX_WIDTH,
		key?: NodeKey,
	) {
		super(key)
		this.__fileName = fileName
		this.__driveFileId = driveFileId
		this.__sceneJson = sceneJson
		this.__width = width
		this.__height = height
		this.__maxWidth = maxWidth
	}

	exportJSON(): SerializedExcalidrawNode {
		const serialized: SerializedExcalidrawNode = {
			...super.exportJSON(),
			fileName: this.__fileName,
			maxWidth: this.__maxWidth,
			type: 'excalidraw',
			version: 1,
		}
		if (this.__driveFileId) serialized.driveFileId = this.__driveFileId
		if (this.__sceneJson) serialized.sceneJson = this.__sceneJson
		if (this.__width !== 'inherit') serialized.width = this.__width
		if (this.__height !== 'inherit') serialized.height = this.__height
		return serialized
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('div')
		element.setAttribute('data-lexical-excalidraw', 'true')
		element.setAttribute('data-file-name', this.__fileName)
		return { element }
	}

	createDOM(config: EditorConfig): HTMLElement {
		const span = document.createElement('span')
		const className = config.theme.excalidraw
		if (className !== undefined) {
			span.className = className
		}
		return span
	}

	updateDOM(): false {
		return false
	}

	isInline(): boolean {
		return false
	}

	getFileName(): string {
		return this.__fileName
	}

	getDriveFileId(): string | null {
		return this.__driveFileId
	}

	getSceneJson(): string | null {
		return this.__sceneJson
	}

	getWidth(): 'inherit' | number {
		return this.__width
	}

	getHeight(): 'inherit' | number {
		return this.__height
	}

	getMaxWidth(): number {
		return this.__maxWidth
	}

	setDriveFileId(driveFileId: string): void {
		const writable = this.getWritable()
		writable.__driveFileId = driveFileId
	}

	setSceneJson(sceneJson: string): void {
		const writable = this.getWritable()
		writable.__sceneJson = sceneJson
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
			<Suspense fallback={<div className="lexical-excalidraw-loading" />}>
				<ExcalidrawComponent
					driveFileId={this.__driveFileId}
					fileName={this.__fileName}
					height={this.__height}
					maxWidth={this.__maxWidth}
					nodeKey={this.getKey()}
					sceneJson={this.__sceneJson}
					width={this.__width}
				/>
			</Suspense>
		)
	}
}

export function $createExcalidrawNode({
	driveFileId = null,
	fileName,
	height = DEFAULT_EXCALIDRAW_HEIGHT,
	key,
	maxWidth = DEFAULT_EXCALIDRAW_MAX_WIDTH,
	sceneJson = null,
	width = DEFAULT_EXCALIDRAW_WIDTH,
}: {
	driveFileId?: string | null
	fileName: string
	height?: 'inherit' | number
	key?: NodeKey
	maxWidth?: number
	sceneJson?: string | null
	width?: 'inherit' | number
}): ExcalidrawNode {
	return $applyNodeReplacement(
		new ExcalidrawNode(
			fileName,
			driveFileId,
			sceneJson,
			width,
			height,
			maxWidth,
			key,
		),
	)
}

export function $isExcalidrawNode(
	node: LexicalNode | null | undefined,
): node is ExcalidrawNode {
	return node instanceof ExcalidrawNode
}
