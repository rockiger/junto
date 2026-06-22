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
}

const ExcalidrawEditorContext =
	createContext<ExcalidrawEditorContextValue | null>(null)

export function ExcalidrawEditorProvider({
	children,
	fileId,
	onOpenModal,
	pageFileName,
	syncWikiMarkdown,
}: {
	children: ReactNode
	fileId?: string
	onOpenModal: (options: ExcalidrawModalOpenOptions) => void
	pageFileName?: string
	syncWikiMarkdown?: () => void
}) {
	const value = useMemo(
		() => ({
			fileId,
			openExcalidrawModal: onOpenModal,
			pageFileName,
			syncWikiMarkdown,
		}),
		[fileId, onOpenModal, pageFileName, syncWikiMarkdown],
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
