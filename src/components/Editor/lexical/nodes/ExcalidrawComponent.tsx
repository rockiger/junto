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
import { downloadFileBlob } from 'lib/gdrive'
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type JSX,
} from 'react'
import { useGlobal } from 'reactn'
import type { IFile } from 'reactn/default'
import {
	getSvgFileName,
	resolveAndDownloadExcalidrawScene,
	resolveExcalidrawDriveFileId,
	uploadExcalidrawSvgOnly,
} from '../lib/excalidrawDrive'
import { sceneJsonToSvgString } from '../lib/excalidrawExport'
import {
	useExcalidrawEditor,
	useOpenExcalidrawModal,
} from '../lib/ExcalidrawEditorContext'
import ImageResizer from '../ui/ImageResizer'
import { $isExcalidrawNode } from './ExcalidrawNode'

interface ExcalidrawComponentProps {
	driveFileId: string | null
	fileName: string
	height: 'inherit' | number
	maxWidth: number
	nodeKey: NodeKey
	sceneJson: string | null
	width: 'inherit' | number
}

export default function ExcalidrawComponent({
	driveFileId,
	fileName,
	height,
	maxWidth,
	nodeKey,
	sceneJson,
	width,
}: ExcalidrawComponentProps): JSX.Element {
	const previewRef = useRef<HTMLImageElement>(null)
	const [editor] = useLexicalComposerContext()
	const isEditable = useLexicalEditable()
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey)
	const [isResizing, setIsResizing] = useState(false)
	const { fileId, previewVersions } = useExcalidrawEditor()
	const previewVersion = previewVersions[nodeKey] ?? 0
	const openModal = useOpenExcalidrawModal()
	const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
	const [files, setFiles] = useGlobal('files')
	const [resolvedSceneJson, setResolvedSceneJson] = useState<string | null>(
		sceneJson,
	)
	const [displaySrc, setDisplaySrc] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [editLoading, setEditLoading] = useState(false)
	const [failed, setFailed] = useState(false)

	const hasExplicitSize = width !== 'inherit' || height !== 'inherit'

	const isInNodeSelection = useMemo(
		() =>
			isSelected &&
			editor.read(() => {
				const selection = $getSelection()
				return $isNodeSelection(selection) && selection.has(nodeKey)
			}),
		[editor, isSelected, nodeKey],
	)

	const allFiles = useMemo(
		() => [
			...((initialFiles ?? []) as IFile[]),
			...((files ?? []) as IFile[]),
		],
		[files, initialFiles],
	)
	const allFilesRef = useRef(allFiles)
	allFilesRef.current = allFiles
	const filesRef = useRef(files)
	filesRef.current = files
	const initialFilesRef = useRef(initialFiles)
	initialFilesRef.current = initialFiles

	const cacheSceneOnNode = useCallback(
		(jsonDriveId: string, json: string) => {
			setResolvedSceneJson(json)
			editor.update(() => {
				const node = $getNodeByKey(nodeKey)
				if ($isExcalidrawNode(node)) {
					node.setDriveFileId(jsonDriveId)
					node.setSceneJson(json)
				}
			})
		},
		[editor, nodeKey],
	)

	const ensureSceneJson = useCallback(async (): Promise<string | null> => {
		if (resolvedSceneJson) return resolvedSceneJson
		if (sceneJson) return sceneJson
		if (!fileId) return null

		const result = await resolveAndDownloadExcalidrawScene({
			driveFileId,
			fileName,
			files: allFiles,
			pageFileId: fileId,
		})
		if (!result) return null
		cacheSceneOnNode(result.driveFileId, result.sceneJson)
		return result.sceneJson
	}, [
		allFiles,
		cacheSceneOnNode,
		driveFileId,
		fileId,
		fileName,
		resolvedSceneJson,
		sceneJson,
	])

	useEffect(() => {
		if (!fileId) {
			setLoading(false)
			return
		}

		let objectUrl: string | null = null
		let cancelled = false
		const currentFiles = allFilesRef.current

		async function loadPreview() {
			const pageId = fileId
			if (!pageId) return

			setLoading(true)
			setFailed(false)
			setDisplaySrc(null)

			try {
				const sceneResult =
					sceneJson != null
						? { driveFileId: driveFileId ?? '', sceneJson }
						: await resolveAndDownloadExcalidrawScene({
								driveFileId,
								fileName,
								files: currentFiles,
								pageFileId: pageId,
							})
				if (cancelled) return

				if (!sceneResult) {
					if (!cancelled) {
						setLoading(false)
						setFailed(true)
					}
					return
				}

				if (!sceneJson) {
					cacheSceneOnNode(
						sceneResult.driveFileId,
						sceneResult.sceneJson,
					)
				}

				const svgFileName = getSvgFileName(fileName)
				let svgDriveId = await resolveExcalidrawDriveFileId(
					svgFileName,
					pageId,
					allFilesRef.current,
				)

				if (!svgDriveId) {
					const svgString = await sceneJsonToSvgString(
						sceneResult.sceneJson,
					)
					if (cancelled) return

					const { svgDriveFileId, svgFile } =
						await uploadExcalidrawSvgOnly({
							jsonFileName: fileName,
							pageFileId: pageId,
							files: allFilesRef.current,
							svg: svgString,
						})
					svgDriveId = svgDriveFileId

					const upsert = (list: IFile[]) => {
						const idx = list.findIndex((f) => f.id === svgFile.id)
						if (idx >= 0) {
							const next = [...list]
							next[idx] = svgFile
							return next
						}
						return [...list, svgFile]
					}
					setFiles(upsert((filesRef.current ?? []) as IFile[]))
					setInitialFiles(
						upsert((initialFilesRef.current ?? []) as IFile[]),
					)
				}

				if (!svgDriveId) {
					if (!cancelled) {
						setLoading(false)
						setFailed(true)
					}
					return
				}

				const blob = await downloadFileBlob(svgDriveId)
				if (cancelled) return
				objectUrl = URL.createObjectURL(blob)
				setDisplaySrc(objectUrl)
				setLoading(false)
			} catch {
				if (!cancelled) {
					setLoading(false)
					setFailed(true)
				}
			}
		}

		void loadPreview()
		return () => {
			cancelled = true
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [cacheSceneOnNode, fileId, fileName, previewVersion, setFiles, setInitialFiles])

	useEffect(() => {
		if (sceneJson) {
			setResolvedSceneJson(sceneJson)
		}
	}, [sceneJson])

	const onDoubleClick = useCallback(() => {
		if (!isEditable || editLoading) return
		setEditLoading(true)
		void ensureSceneJson()
			.then((json) => {
				if (!json) return
				openModal({
					mode: 'edit',
					nodeKey,
					fileName,
					driveFileId,
					sceneJson: json,
				})
			})
			.finally(() => {
				setEditLoading(false)
			})
	}, [
		driveFileId,
		editLoading,
		ensureSceneJson,
		fileName,
		isEditable,
		nodeKey,
		openModal,
	])

	const onClick = useCallback(
		(payload: MouseEvent) => {
			if (isResizing) return true
			const target = payload.target as HTMLElement
			if (!target.closest(`[data-excalidraw-node-key="${nodeKey}"]`)) {
				return false
			}
			if (payload.detail === 2) {
				onDoubleClick()
				return true
			}
			if (payload.shiftKey) {
				setSelected(!isSelected)
			} else {
				clearSelection()
				setSelected(true)
			}
			return true
		},
		[
			clearSelection,
			isResizing,
			isSelected,
			nodeKey,
			onDoubleClick,
			setSelected,
		],
	)

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event: DragEvent) => {
					if (event.target === previewRef.current) {
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
			if ($isExcalidrawNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight)
			}
		})
	}

	const onResizeStart = () => {
		setIsResizing(true)
	}

	const draggable = isInNodeSelection && !isResizing
	const isFocused = (isSelected || isResizing) && isEditable

	if (failed) {
		return (
			<span className="text-fg-muted italic">
				Drawing not found: {fileName}
			</span>
		)
	}

	return (
		<>
			{loading && (
				<div
					aria-hidden
					className="lexical-excalidraw-placeholder"
				>
					Loading drawing…
				</div>
			)}
			{displaySrc && (
				<div
					className="lexical-excalidraw-preview-wrap"
					data-excalidraw-node-key={nodeKey}
					draggable={draggable}
				>
					<img
						ref={previewRef}
						src={displaySrc}
						alt={fileName}
						draggable={false}
						onLoad={() => setLoading(false)}
						className={clsx(
							'lexical-excalidraw-preview-img',
							!hasExplicitSize && 'lexical-excalidraw-preview-img--auto',
							loading ? 'hidden' : 'block',
							isFocused &&
								isInNodeSelection &&
								'lexical-excalidraw-focused',
							isFocused &&
								isInNodeSelection &&
								'lexical-excalidraw-draggable',
						)}
						style={{
							height: height === 'inherit' ? undefined : height,
							maxWidth,
							width: width === 'inherit' ? undefined : width,
						}}
					/>
					{isEditable && !loading && (
						<div className="lexical-excalidraw-hint">
							{editLoading ? 'Loading drawing…' : 'Double-click to edit'}
						</div>
					)}
				</div>
			)}
			{!loading && !displaySrc && !failed && (
				<div className="lexical-excalidraw-placeholder">
					Empty drawing — double-click to edit
				</div>
			)}
			{isInNodeSelection && isFocused && displaySrc && !loading && (
				<ImageResizer
					editor={editor}
					imageRef={previewRef}
					maxWidth={maxWidth}
					onResizeStart={onResizeStart}
					onResizeEnd={onResizeEnd}
				/>
			)}
		</>
	)
}
