import { $insertNodeToNearestRoot } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	$getNodeByKey,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	HISTORY_MERGE_TAG,
	type LexicalCommand,
} from 'lexical'
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { useGlobal } from 'reactn'
import type { IFile } from 'reactn/default'
import ExcalidrawModal, {
	type ExcalidrawModalHandle,
} from '../ExcalidrawModal'
import {
	generateExcalidrawFileName,
	getSvgFileName,
	resolveExcalidrawDriveFileId,
	uploadExcalidrawDrawing,
} from '../lib/excalidrawDrive'
import { sceneJsonToSvgString } from '../lib/excalidrawExport'
import {
	ExcalidrawEditorProvider,
	type ExcalidrawModalOpenOptions,
} from '../lib/ExcalidrawEditorContext'
import {
	$createExcalidrawNode,
	$isExcalidrawNode,
	ExcalidrawNode,
} from '../nodes/ExcalidrawNode'

export const INSERT_EXCALIDRAW_COMMAND: LexicalCommand<void> = createCommand(
	'INSERT_EXCALIDRAW_COMMAND',
)

// Drive files are intentionally not deleted when the block is removed so other
// pages in the same wiki folder can reference the same drawing filename.

export default function ExcalidrawPlugin({
	children,
	fileId,
	pageFileName,
	syncWikiMarkdown,
}: {
	children: ReactNode
	fileId?: string
	pageFileName?: string
	syncWikiMarkdown?: () => void
}) {
	const [editor] = useLexicalComposerContext()
	const [files, setFiles] = useGlobal('files')
	const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
	const modalRef = useRef<ExcalidrawModalHandle>(null)
	const [previewVersions, setPreviewVersions] = useState<
		Record<string, number>
	>({})
	const bumpPreviewRefresh = useCallback((nodeKey: string) => {
		setPreviewVersions((prev) => ({
			...prev,
			[nodeKey]: (prev[nodeKey] ?? 0) + 1,
		}))
	}, [])

	const openModal = useCallback((options: ExcalidrawModalOpenOptions) => {
		modalRef.current?.open(options)
	}, [])

	const persistScene = useCallback(
		async (
			state: ExcalidrawModalOpenOptions & { sceneJson: string },
		) => {
			if (!fileId) {
				console.error('No page id for Excalidraw upload')
				return
			}

			const jsonFileName =
				state.fileName ??
				(pageFileName
					? generateExcalidrawFileName(pageFileName)
					: generateExcalidrawFileName('page'))
			const allFiles = [
				...((initialFiles ?? []) as IFile[]),
				...((files ?? []) as IFile[]),
			]

			try {
				const svg = await sceneJsonToSvgString(state.sceneJson)
				const svgFileName = getSvgFileName(jsonFileName)
				let svgDriveFileId: string | null = null
				if (state.driveFileId) {
					svgDriveFileId = await resolveExcalidrawDriveFileId(
						svgFileName,
						fileId,
						allFiles,
					)
				}

				const { jsonDriveFileId, jsonFile, svgFile } =
					await uploadExcalidrawDrawing({
						json: state.sceneJson,
						jsonDriveFileId: state.driveFileId,
						jsonFileName,
						files: allFiles,
						pageFileId: fileId,
						svg,
						svgDriveFileId,
					})

				const currentFiles = (files ?? []) as IFile[]
				const currentInitialFiles = (initialFiles ?? []) as IFile[]
				const upsert = (list: IFile[]) => {
					let next = [...list]
					for (const file of [jsonFile, svgFile]) {
						const idx = next.findIndex((f) => f.id === file.id)
						if (idx >= 0) {
							next[idx] = file
						} else {
							next = [...next, file]
						}
					}
					return next
				}
				setFiles(upsert(currentFiles))
				setInitialFiles(upsert(currentInitialFiles))

				editor.update(
					() => {
						if (state.mode === 'edit' && state.nodeKey) {
							const node = $getNodeByKey(state.nodeKey)
							if (!$isExcalidrawNode(node)) return
							node.setSceneJson(state.sceneJson)
							node.setDriveFileId(jsonDriveFileId)
							return
						}

						const excalidrawNode = $createExcalidrawNode({
							driveFileId: jsonDriveFileId,
							fileName: jsonFileName,
							sceneJson: state.sceneJson,
						})
						$insertNodeToNearestRoot(excalidrawNode)
					},
					{ tag: HISTORY_MERGE_TAG },
				)
				if (state.mode === 'edit' && state.nodeKey) {
					bumpPreviewRefresh(state.nodeKey)
				}
				// OnChangePlugin ignores history-merge updates; persist markdown now.
				syncWikiMarkdown?.()
			} catch (err) {
				console.error('Excalidraw upload failed', err)
				alert('Could not save drawing. Please try again.')
			}
		},
		[
			bumpPreviewRefresh,
			editor,
			fileId,
			files,
			initialFiles,
			pageFileName,
			setFiles,
			setInitialFiles,
			syncWikiMarkdown,
		],
	)

	const handleDiscard = useCallback(
		(_state: ExcalidrawModalOpenOptions) => {
			editor.update(() => {}, { tag: HISTORY_MERGE_TAG })
		},
		[editor],
	)

	useEffect(() => {
		if (!editor.hasNodes([ExcalidrawNode])) {
			throw new Error(
				'ExcalidrawPlugin: ExcalidrawNode not registered on editor',
			)
		}

		return editor.registerCommand(
			INSERT_EXCALIDRAW_COMMAND,
			() => {
				openModal({ mode: 'insert' })
				return true
			},
			COMMAND_PRIORITY_EDITOR,
		)
	}, [editor, openModal])

	return (
		<ExcalidrawEditorProvider
			fileId={fileId}
			onOpenModal={openModal}
			pageFileName={pageFileName}
			syncWikiMarkdown={syncWikiMarkdown}
			previewVersions={previewVersions}
			bumpPreviewRefresh={bumpPreviewRefresh}
		>
			{children}
			<ExcalidrawModal
				ref={modalRef}
				onDiscard={handleDiscard}
				onSave={(state) => {
					void persistScene(state)
				}}
			/>
		</ExcalidrawEditorProvider>
	)
}
