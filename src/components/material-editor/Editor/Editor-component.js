import React from 'react'
import { Editor as SlateEditor } from 'slate-react'
import { ToggleButtonGroup } from '@material-ui/lab'
import FormatBoldIcon from 'mdi-react/FormatBoldIcon'
import FormatItalicIcon from 'mdi-react/FormatItalicIcon'
import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import FormatStrikethroughIcon from 'mdi-react/FormatStrikethroughVariantIcon'
import CodeTagsIcon from 'mdi-react/CodeTagsIcon'
import FormatHeader1Icon from 'mdi-react/FormatHeader1Icon'
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon'
import CodeBracesIcon from 'mdi-react/CodeBracesIcon'
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon'
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon'
import ImageIcon from 'mdi-react/ImageIcon'
import LinkIcon from 'mdi-react/LinkIcon'
import GoogleDriveIcon from 'mdi-react/GoogleDriveIcon'
import TableLargeIcon from 'mdi-react/TableLargeIcon'
import TableColumnPlusAfterIcon from 'mdi-react/TableColumnPlusAfterIcon'
import TableRowPlusAfterIcon from 'mdi-react/TableRowPlusAfterIcon'
import TableColumnRemoveIcon from 'mdi-react/TableColumnRemoveIcon'
import TableRowRemoveIcon from 'mdi-react/TableRowRemoveIcon'
import TableLargeRemoveIcon from 'mdi-react/TableLargeRemoveIcon'
import PageLayoutHeaderIcon from 'mdi-react/PageLayoutHeaderIcon'

import { linkPlugin, LinkModal } from '../Link'
import {
    boldPlugin,
    codePlugin,
    italicPlugin,
    strikethroughPlugin,
    underlinePlugin,
    renderMarkButton,
} from '../Mark'
import {
    h1Plugin,
    h2Plugin,
    blistPlugin,
    nlistPlugin,
    quotePlugin,
    renderBlockButton,
} from '../Block'
import { codeBlockPlugin } from '../Code'
import { EditorToolbar } from '../Toolbar/Toolbar-container'

import { renderDriveButton } from '../Drive'
import { renderImageButton } from '../Image'
import { renderLinkButton } from '../Link'
import { renderTableButton } from '../Table'

import './Editor.css'

export function EditorComponent({
    apiKey,
    decorateNode,
    items,
    plugins,
    value,
    onChange,
    onPaste,
    editorRef,
    readOnly,
    renderBlock,
    renderDecoration,
    renderMark,
    modalRef,
    schema,
    style,
}) {
    return (
        <>
            {!readOnly && (
                <EditorToolbar>
                    <ToggleButtonGroup
                        style={{
                            marginRight: '1rem',
                        }}
                    >
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <FormatHeader1Icon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'heading-one',
                            h1Plugin.shortcut
                        )}
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <FormatHeader2Icon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'heading-two',
                            h2Plugin.shortcut
                        )}
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <FormatQuoteCloseIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'block-quote',
                            quotePlugin.shortcut
                        )}
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        style={{
                            marginRight: '1rem',
                        }}
                    >
                        {renderMarkButton(
                            editorRef.current,
                            value,
                            <FormatBoldIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'bold',
                            boldPlugin.shortcut
                        )}
                        {renderMarkButton(
                            editorRef.current,
                            value,
                            <FormatItalicIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'italic',
                            italicPlugin.shortcut
                        )}
                        {renderMarkButton(
                            editorRef.current,
                            value,
                            <FormatUnderlineIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'underline',
                            underlinePlugin.shortcut
                        )}
                        {renderMarkButton(
                            editorRef.current,
                            value,
                            <FormatStrikethroughIcon
                                style={{
                                    height: 16,
                                }}
                            />,
                            'strikethrough',
                            strikethroughPlugin.shortcut
                        )}
                        {renderMarkButton(
                            editorRef.current,
                            value,
                            <CodeTagsIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'code',
                            codePlugin.shortcut
                        )}
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                        style={{
                            marginRight: '1rem',
                        }}
                    >
                        {renderLinkButton(
                            editorRef.current,
                            value,
                            <LinkIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'link',
                            linkPlugin.shortcut
                        )}
                        {renderImageButton(
                            editorRef.current,
                            value,
                            <ImageIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'image',
                            apiKey
                        )}
                        {renderDriveButton(
                            editorRef.current,
                            <GoogleDriveIcon style={{ height: 18 }} />,
                            apiKey
                        )}
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        style={{
                            marginRight: '1rem',
                        }}
                    >
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <FormatListBulletedIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'bulleted-list',
                            blistPlugin.shortcut
                        )}
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <FormatListNumberedIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'numbered-list',
                            nlistPlugin.shortcut
                        )}
                        {renderBlockButton(
                            editorRef.current,
                            value,
                            <CodeBracesIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'code',
                            codeBlockPlugin.shortcut
                        )}
                    </ToggleButtonGroup>
                    <ToggleButtonGroup>
                        {renderTableButton(
                            editorRef.current,
                            <TableLargeIcon
                                style={{
                                    height: 18,
                                }}
                            />,
                            'insertTable'
                        )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <TableLargeRemoveIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'removeTable'
                            )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <TableColumnPlusAfterIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'insertColumn'
                            )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <TableColumnRemoveIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'removeColumn'
                            )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <TableRowPlusAfterIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'insertRow'
                            )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <TableRowRemoveIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'removeRow'
                            )}
                        {hasTable(editorRef.current) &&
                            renderTableButton(
                                editorRef.current,
                                <PageLayoutHeaderIcon
                                    style={{
                                        height: 18,
                                    }}
                                />,
                                'toggleTableHeaders',
                                codeBlockPlugin.shortcut
                            )}
                    </ToggleButtonGroup>
                </EditorToolbar>
            )}
            <SlateEditor
                decorateNode={decorateNode}
                id="SlateEditor"
                plugins={plugins}
                value={value}
                onChange={onChange}
                onPaste={onPaste}
                placeholder="Bring your content to life with text, images, files, code blocks and pictures from Google Drive. 
                Did you know you can write even faster with Markdown?"
                readOnly={readOnly}
                ref={editorRef}
                renderBlock={renderBlock}
                renderDecoration={renderDecoration}
                renderMark={renderMark}
                schema={schema}
                style={
                    style
                        ? style
                        : {
                              fontSize: '1rem',
                              height: 'calc(100vh - 64px - 58px)',
                              overflowY: 'auto',
                              padding: '0 .5rem',
                          }
                }
            />
            <LinkModal ref={modalRef} items={items} />
        </>
    )
}

function hasTable(editor) {
    return editor && editor.isSelectionInTable()
}
