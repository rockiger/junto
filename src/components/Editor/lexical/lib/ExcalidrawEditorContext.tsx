import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	type ReactNode,
} from 'react'

export type ExcalidrawModalMode = 'insert' | 'edit'

export type ExcalidrawModalOpenOptions = {
	mode: ExcalidrawModalMode
	nodeKey?: string
	fileName?: string
	driveFileId?: string | null
	sceneJson?: string | null
}

export type ExcalidrawEditorContextValue = {
	fileId?: string
	pageFileName?: string
	openExcalidrawModal: (options: ExcalidrawModalOpenOptions) => void
	syncWikiMarkdown?: () => void
	previewVersions: Record<string, number>
	bumpPreviewRefresh: (nodeKey: string) => void
}

const ExcalidrawEditorContext =
	createContext<ExcalidrawEditorContextValue | null>(null)

export function ExcalidrawEditorProvider({
	children,
	fileId,
	onOpenModal,
	pageFileName,
	syncWikiMarkdown,
	previewVersions,
	bumpPreviewRefresh,
}: {
	children: ReactNode
	fileId?: string
	onOpenModal: (options: ExcalidrawModalOpenOptions) => void
	pageFileName?: string
	syncWikiMarkdown?: () => void
	previewVersions: Record<string, number>
	bumpPreviewRefresh: (nodeKey: string) => void
}) {
	const value = useMemo(
		() => ({
			fileId,
			openExcalidrawModal: onOpenModal,
			pageFileName,
			syncWikiMarkdown,
			previewVersions,
			bumpPreviewRefresh,
		}),
		[
			bumpPreviewRefresh,
			fileId,
			onOpenModal,
			pageFileName,
			previewVersions,
			syncWikiMarkdown,
		],
	)

	return (
		<ExcalidrawEditorContext.Provider value={value}>
			{children}
		</ExcalidrawEditorContext.Provider>
	)
}

export function useExcalidrawEditor(): ExcalidrawEditorContextValue {
	const context = useContext(ExcalidrawEditorContext)
	if (!context) {
		return {
			fileId: undefined,
			openExcalidrawModal: () => {},
			pageFileName: undefined,
			syncWikiMarkdown: undefined,
			previewVersions: {},
			bumpPreviewRefresh: () => {},
		}
	}
	return context
}

export function useOpenExcalidrawModal() {
	const { openExcalidrawModal } = useExcalidrawEditor()
	return useCallback(
		(options: ExcalidrawModalOpenOptions) => {
			openExcalidrawModal(options)
		},
		[openExcalidrawModal],
	)
}
