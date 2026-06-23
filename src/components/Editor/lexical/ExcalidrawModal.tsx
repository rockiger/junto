import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type JSX,
} from 'react'
import { Button } from 'react-aria-components'
import type { ExcalidrawModalOpenOptions } from './lib/ExcalidrawEditorContext'

export interface ExcalidrawModalHandle {
	open: (options: ExcalidrawModalOpenOptions) => void
}

type ModalState = ExcalidrawModalOpenOptions & {
	isOpen: boolean
}

type ExcalidrawApi = {
	getSceneElements: () => readonly import('@excalidraw/excalidraw/element/types').ExcalidrawElement[]
	getAppState: () => Partial<import('@excalidraw/excalidraw/types').AppState>
	getFiles: () => import('@excalidraw/excalidraw/types').BinaryFiles
}

const ExcalidrawEditor = forwardRef<
	{ getSceneJson: () => string | null },
	{
		initialSceneJson: string | null
	}
>(function ExcalidrawEditor({ initialSceneJson }, ref) {
	const apiRef = useRef<ExcalidrawApi | null>(null)
	const serializeRef = useRef<
		(
			elements: ExcalidrawApi['getSceneElements'] extends () => infer E
				? E
				: never,
			appState: ReturnType<ExcalidrawApi['getAppState']>,
			files: ReturnType<ExcalidrawApi['getFiles']>,
			type: 'local' | 'database',
		) => string
	 | null>(null)
	const [Editor, setEditor] = useState<
		((props: { initialSceneJson: string | null }) => JSX.Element) | null
	>(null)

	useImperativeHandle(ref, () => ({
		getSceneJson: () => {
			const api = apiRef.current
			const serializeAsJSON = serializeRef.current
			if (!api || !serializeAsJSON) return null
			return serializeAsJSON(
				api.getSceneElements(),
				api.getAppState(),
				api.getFiles(),
				'local',
			)
		},
	}))

	useEffect(() => {
		let cancelled = false
		void Promise.all([
			import('@excalidraw/excalidraw'),
			import('@excalidraw/excalidraw/index.css'),
		]).then(([mod]) => {
			if (cancelled) return
			const { Excalidraw, restore, serializeAsJSON } = mod
			serializeRef.current = serializeAsJSON
			setEditor(() =>
				function ExcalidrawEditorInner({
					initialSceneJson: sceneJson,
				}: {
					initialSceneJson: string | null
				}) {
					let initialData
					if (sceneJson) {
						try {
							initialData = restore(JSON.parse(sceneJson), null, null)
						} catch {
							initialData = undefined
						}
					}
					return (
						<Excalidraw
							initialData={initialData}
							excalidrawAPI={(api) => {
								apiRef.current = api as ExcalidrawApi
							}}
						/>
					)
				},
			)
		})
		return () => {
			cancelled = true
		}
	}, [])

	if (!Editor) {
		return (
			<div className="lexical-excalidraw-modal-loading">Loading editor…</div>
		)
	}

	return <Editor initialSceneJson={initialSceneJson} />
})

export interface ExcalidrawModalProps {
	onSave?: (
		state: ExcalidrawModalOpenOptions & { sceneJson: string },
	) => void
	onDiscard?: (state: ExcalidrawModalOpenOptions) => void
}

export const ExcalidrawModal = forwardRef<
	ExcalidrawModalHandle,
	ExcalidrawModalProps
>(function ExcalidrawModal({ onSave, onDiscard }, ref) {
	const [state, setState] = useState<ModalState>({
		isOpen: false,
		mode: 'insert',
	})
	const editorRef = useRef<{ getSceneJson: () => string | null }>(null)

	const open = useCallback((options: ExcalidrawModalOpenOptions) => {
		setState({ ...options, isOpen: true })
	}, [])

	useImperativeHandle(ref, () => ({ open }), [open])

	const close = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }))
	}, [])

	const handleDiscard = useCallback(() => {
		const current = state
		close()
		onDiscard?.(current)
	}, [close, onDiscard, state])

	const handleSave = useCallback(() => {
		const sceneJson = editorRef.current?.getSceneJson()
		if (!sceneJson) return
		const current = state
		onSave?.({ ...current, sceneJson })
		close()
	}, [close, onSave, state])

	if (!state.isOpen) return null

	return (
		<div className="lexical-excalidraw-modal-overlay">
			<div className="lexical-excalidraw-modal">
				<div className="lexical-excalidraw-modal-toolbar">
					<span className="lexical-excalidraw-modal-title">
						{state.mode === 'insert' ? 'New drawing' : 'Edit drawing'}
					</span>
					<div className="lexical-excalidraw-modal-actions">
						<Button
							type="button"
							className="lexical-excalidraw-modal-btn lexical-excalidraw-modal-btn--secondary"
							onPress={handleDiscard}
						>
							Discard
						</Button>
						<Button
							type="button"
							className="lexical-excalidraw-modal-btn lexical-excalidraw-modal-btn--primary"
							onPress={handleSave}
						>
							Save
						</Button>
					</div>
				</div>
				<div className="lexical-excalidraw-modal-body">
					<ExcalidrawEditor
						ref={editorRef}
						initialSceneJson={state.sceneJson ?? null}
						key={`${state.mode}-${state.nodeKey ?? 'new'}-${state.fileName ?? ''}`}
					/>
				</div>
			</div>
		</div>
	)
})

export default ExcalidrawModal
