import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import clsx from 'clsx'
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	DRAGSTART_COMMAND,
	mergeRegister,
	type NodeKey,
} from 'lexical'
import { downloadFileBlob, parseDriveImageFileId } from 'lib/gdrive'
import {
	type JSX,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import ImageResizer from '../ui/ImageResizer'
import { $isImageNode } from './ImageNode'

interface ImageComponentProps {
	altText: string
	height: 'inherit' | number
	nodeKey: NodeKey
	src: string
	width: 'inherit' | number
}

export default function ImageComponent({
	src,
	altText,
	nodeKey,
	width,
	height,
}: ImageComponentProps): JSX.Element {
	const imageRef = useRef<HTMLImageElement>(null)
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey)
	const [isResizing, setIsResizing] = useState(false)
	const [editor] = useLexicalComposerContext()
	const isEditable = useLexicalEditable()
	const driveFileId = parseDriveImageFileId(src)
	const [displaySrc, setDisplaySrc] = useState<string | null>(
		driveFileId ? null : src,
	)
	const [loading, setLoading] = useState(true)
	const [failed, setFailed] = useState(false)

	const isInNodeSelection = useMemo(
		() =>
			isSelected &&
			editor.read(() => {
				const selection = $getSelection()
				return $isNodeSelection(selection) && selection.has(nodeKey)
			}),
		[editor, isSelected, nodeKey],
	)

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

	const onClick = useCallback(
		(payload: MouseEvent) => {
			if (isResizing) {
				return true
			}
			if (payload.target === imageRef.current) {
				if (payload.shiftKey) {
					setSelected(!isSelected)
				} else {
					clearSelection()
					setSelected(true)
				}
				return true
			}
			return false
		},
		[isResizing, isSelected, setSelected, clearSelection],
	)

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				CLICK_COMMAND,
				onClick,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event: DragEvent) => {
					if (event.target === imageRef.current) {
						event.preventDefault()
						return true
					}
					return false
				},
				COMMAND_PRIORITY_LOW,
			),
		)
	}, [editor, onClick])

	const onResizeEnd = (
		nextWidth: 'inherit' | number,
		nextHeight: 'inherit' | number,
	) => {
		setTimeout(() => {
			setIsResizing(false)
		}, 200)

		editor.update(() => {
			const node = $getNodeByKey(nodeKey)
			if ($isImageNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight)
			}
		})
	}

	const onResizeStart = () => {
		setIsResizing(true)
	}

	const draggable = isInNodeSelection && !isResizing
	const isFocused = (isSelected || isResizing) && isEditable
	const hasExplicitSize = width !== 'inherit' || height !== 'inherit'

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
				<div draggable={draggable}>
					<img
						ref={imageRef}
						src={displaySrc}
						alt={altText}
						draggable={false}
						onError={() => setFailed(true)}
						onLoad={() => setLoading(false)}
						className={clsx(
							!hasExplicitSize && 'max-h-[20em]',
							loading ? 'hidden' : 'block',
							isFocused &&
							isInNodeSelection &&
							'lexical-image-focused',
							isFocused && isInNodeSelection && 'lexical-image-draggable',
						)}
						style={{
							height: height === 'inherit' ? undefined : height,
							width: width === 'inherit' ? undefined : width,
						}}
					/>
				</div>
			)}
			{isInNodeSelection && isFocused && displaySrc && !loading && (
				<ImageResizer
					editor={editor}
					imageRef={imageRef}
					onResizeStart={onResizeStart}
					onResizeEnd={onResizeEnd}
				/>
			)}
		</>
	)
}
