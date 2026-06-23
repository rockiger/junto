import { $getRoot } from "lexical";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { PAGE_WIDTH_REDUCED } from "lib/pageWidth";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	$exportWikiMarkdown,
	$importWikiMarkdown,
	WIKI_NODES,
} from "./markdown";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugin";
import GoogleDriveLinkPlugin from "./plugins/GoogleDriveLinkPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import InternalWikiLinkPlugin from "./plugins/InternalWikiLinkPlugin";
import LayoutPlugin from "./plugins/LayoutPlugin";
import ReadOnlyCheckListPlugin from "./plugins/ReadOnlyCheckListPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import WikiSlashCommandPlugin from "./plugins/WikiSlashCommandPlugin";
import { wikiTheme } from "./theme";
import { WIKI_TRANSFORMERS } from "./transformers";

const PLACEHOLDER_TEXT =
	"Bring your content to life with text, images, files, code blocks and pictures from Google Drive. Did you know you can write even faster with Markdown?";

function scrollToDocumentStart(editor) {
	editor.update(
		() => {
			$getRoot().selectStart();
		},
		{ discrete: true },
	);

	requestAnimationFrame(() => {
		editor.getRootElement()?.scrollTo({ top: 0 });
		document.getElementById("main-content")?.scrollTo({ top: 0 });
		window.scrollTo({ top: 0 });
	});
}

function EditablePlugin({ readOnly }) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		editor.setEditable(!readOnly);
	}, [editor, readOnly]);
	return null;
}

function DocumentStartPlugin({ fileId }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		scrollToDocumentStart(editor);
	}, [editor, fileId]);

	return null;
}

function EditModeScrollPlugin({ readOnly }) {
	const [editor] = useLexicalComposerContext();
	const prevReadOnlyRef = useRef(readOnly);

	useEffect(() => {
		if (prevReadOnlyRef.current && !readOnly) {
			scrollToDocumentStart(editor);
		}
		prevReadOnlyRef.current = readOnly;
	}, [editor, readOnly]);

	return null;
}

function WikiEditorInner({
	apiKey,
	canEdit,
	fileId,
	floatingAnchorElem,
	onAnchorRef,
	onChangeMarkdown,
	pageFileName,
	pageWidth,
	readOnly,
	style,
	items,
	editorRef,
}) {
	const [editor] = useLexicalComposerContext();

	const syncWikiMarkdown = useCallback(() => {
		if (!onChangeMarkdown) return;
		editor.read(() => {
			onChangeMarkdown($exportWikiMarkdown());
		});
	}, [editor, onChangeMarkdown]);

	return (
		<ExcalidrawPlugin
			fileId={fileId}
			pageFileName={pageFileName}
			syncWikiMarkdown={syncWikiMarkdown}
		>
			<ToolbarPlugin
				apiKey={apiKey}
				fileId={fileId}
				items={items}
				readOnly={readOnly}
			/>
			<div className="lexical-editor-scroller">
				<div
					className={
						canEdit
							? "lexical-editor-anchor lexical-editor-anchor--gutter"
							: "lexical-editor-anchor"
					}
					ref={onAnchorRef}
				>
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								aria-placeholder={PLACEHOLDER_TEXT}
								className={
									pageWidth === PAGE_WIDTH_REDUCED
										? "lexical-content lexical-content--reduced-width"
										: "lexical-content"
								}
								placeholder={
									<div
										style={{
											color: "#999",
											left: 0,
											padding: style?.padding,
											pointerEvents: "none",
											position: "absolute",
											top: 0,
											userSelect: "none",
										}}
									>
										{PLACEHOLDER_TEXT}
									</div>
								}
								style={style}
							/>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
				</div>
			</div>
			{!readOnly && floatingAnchorElem && (
				<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
			)}
			{!readOnly && <WikiSlashCommandPlugin />}
			<HistoryPlugin />
			<ListPlugin />
			{readOnly && canEdit ? (
				<ReadOnlyCheckListPlugin />
			) : (
				<CheckListPlugin disableTakeFocusOnClick={readOnly} />
			)}
			<LinkPlugin />
			<GoogleDriveLinkPlugin />
			<InternalWikiLinkPlugin readOnly={readOnly} />
			<ClickableLinkPlugin />
			<TablePlugin />
			<TabIndentationPlugin />
			<MarkdownShortcutPlugin transformers={WIKI_TRANSFORMERS} />
			<CodeHighlightPlugin />
			<ImagesPlugin />
			<LayoutPlugin />
			<EditablePlugin readOnly={readOnly} />
			<EditModeScrollPlugin readOnly={readOnly} />
			<EditorRefPlugin editorRef={editorRef} />
			<OnChangePlugin
				ignoreHistoryMergeTagChange
				ignoreSelectionChange
				onChange={(editorState) => {
					if (!onChangeMarkdown) return;
					const markdown = editorState.read($exportWikiMarkdown);
					onChangeMarkdown(markdown);
				}}
			/>
		</ExcalidrawPlugin>
	);
}

/**
 * Wiki editor on Lexical. `initialValue` is a raw Markdown string;
 * `onChangeMarkdown` receives the serialized Markdown on every change.
 */
const LexicalWikiEditor = forwardRef(
	(
		{
			apiKey,
			canEdit,
			fileId,
			initialValue,
			items,
			onChangeMarkdown,
			pageFileName,
			pageWidth,
			readOnly,
			style,
		},
		ref,
	) => {
		const editorRef = useRef(null);
		const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

		const onAnchorRef = useCallback((elem) => {
			if (elem !== null) {
				setFloatingAnchorElem(elem);
			}
		}, []);

		useImperativeHandle(ref, () => ({
			focus: () => {
				if (editorRef.current) editorRef.current.focus();
			},
		}));

		// The initial config is only read on mount; later readOnly changes are
		// applied by EditablePlugin, content stays within the same editor.
		const [initialConfig] = useState(() => ({
			editable: !readOnly,
			editorState: () => $importWikiMarkdown(initialValue),
			namespace: "wiki-editor",
			nodes: WIKI_NODES,
			onError: (error) => {
				throw error;
			},
			theme: wikiTheme,
		}));

		return (
			<LexicalComposer initialConfig={initialConfig} key={fileId}>
				<DocumentStartPlugin fileId={fileId} />
				<WikiEditorInner
					apiKey={apiKey}
					canEdit={canEdit}
					editorRef={editorRef}
					fileId={fileId}
					floatingAnchorElem={floatingAnchorElem}
					items={items}
					onAnchorRef={onAnchorRef}
					onChangeMarkdown={onChangeMarkdown}
					pageFileName={pageFileName}
					pageWidth={pageWidth}
					readOnly={readOnly}
					style={style}
				/>
			</LexicalComposer>
		);
	},
);

export default LexicalWikiEditor;
