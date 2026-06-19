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
import {
	forwardRef,
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
import GoogleDriveLinkPlugin from "./plugins/GoogleDriveLinkPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import InternalWikiLinkPlugin from "./plugins/InternalWikiLinkPlugin";
import ReadOnlyCheckListPlugin from "./plugins/ReadOnlyCheckListPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { wikiTheme } from "./theme";
import { WIKI_TRANSFORMERS } from "./transformers";

const PLACEHOLDER_TEXT =
	"Bring your content to life with text, images, files, code blocks and pictures from Google Drive. Did you know you can write even faster with Markdown?";

function EditablePlugin({ readOnly }) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		editor.setEditable(!readOnly);
	}, [editor, readOnly]);
	return null;
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
			readOnly,
			style,
		},
		ref,
	) => {
		const editorRef = useRef(null);

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
			<LexicalComposer initialConfig={initialConfig}>
				<ToolbarPlugin
					apiKey={apiKey}
					fileId={fileId}
					items={items}
					readOnly={readOnly}
				/>
				<div style={{ position: "relative" }}>
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								aria-placeholder={PLACEHOLDER_TEXT}
								className="lexical-content"
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
				<EditablePlugin readOnly={readOnly} />
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
			</LexicalComposer>
		);
	},
);

export default LexicalWikiEditor;
