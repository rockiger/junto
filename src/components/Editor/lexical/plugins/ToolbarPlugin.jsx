import { Tooltip } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { $createCodeNode, $isCodeNode } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $createWikiLinkNode } from '../nodes/WikiLinkNode'
import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
    $deleteTableColumnAtSelection,
    $deleteTableRowAtSelection,
    $getTableNodeFromLexicalNodeOrThrow,
    $insertTableColumnAtSelection,
    $insertTableRowAtSelection,
    $isTableCellNode,
    $isTableRowNode,
    INSERT_TABLE_COMMAND,
    TableCellHeaderStates,
} from '@lexical/table'
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
    $createParagraphNode,
    $createTextNode,
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical'
import CodeBracesIcon from 'mdi-react/CodeBracesIcon'
import CodeTagsIcon from 'mdi-react/CodeTagsIcon'
import FormatBoldIcon from 'mdi-react/FormatBoldIcon'
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'
import FormatHeader3Icon from 'mdi-react/FormatHeader3Icon'
import FormatItalicIcon from 'mdi-react/FormatItalicIcon'
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon'
import FormatListChecksIcon from 'mdi-react/FormatListChecksIcon'
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon'
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon'
import FormatStrikethroughIcon from 'mdi-react/FormatStrikethroughVariantIcon'
import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import GoogleDriveIcon from 'mdi-react/GoogleDriveIcon'
import ImageIcon from 'mdi-react/ImageIcon'
import LinkIcon from 'mdi-react/LinkIcon'
import PageLayoutHeaderIcon from 'mdi-react/PageLayoutHeaderIcon'
import TableColumnPlusAfterIcon from 'mdi-react/TableColumnPlusAfterIcon'
import TableColumnRemoveIcon from 'mdi-react/TableColumnRemoveIcon'
import TableLargeIcon from 'mdi-react/TableLargeIcon'
import TableLargeRemoveIcon from 'mdi-react/TableLargeRemoveIcon'
import TableRowPlusAfterIcon from 'mdi-react/TableRowPlusAfterIcon'
import TableRowRemoveIcon from 'mdi-react/TableRowRemoveIcon'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getDocument, getImage } from '../gpicker'
import { LinkModal } from '../LinkModal'
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin'

const ICON_STYLE = { height: 18 }

const EditorToolbar = props => {
    return (
        <div className="bg-surface-paper border-b border-edge-strong flex max-w-100vw overflow-auto p-2 pl-5 sticky top-0 z-10 lg:top-14">
            {props.children}
        </div>
    )
}

const ToolbarButton = ({ active, value, title, ...props }) => {
    return (
        <Tooltip enterDelay={200} leaveDelay={100} title={title}>
            <ToggleButton
                {...props}
                selected={active}
                size="small"
                style={{ height: 24, padding: 0 }}
                value={value}
            >
                {props.children}
            </ToggleButton>
        </Tooltip>
    )
}

export default function ToolbarPlugin({ apiKey, items }) {
    const [editor] = useLexicalComposerContext()
    const modalRef = useRef(null)
    const [blockType, setBlockType] = useState('paragraph')
    const [formats, setFormats] = useState({})
    const [isLink, setIsLink] = useState(false)
    const [isInTable, setIsInTable] = useState(false)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        setFormats({
            bold: selection.hasFormat('bold'),
            code: selection.hasFormat('code'),
            italic: selection.hasFormat('italic'),
            strikethrough: selection.hasFormat('strikethrough'),
            underline: selection.hasFormat('underline'),
        })

        const anchorNode = selection.anchor.getNode()
        const element =
            anchorNode.getKey() === 'root'
                ? anchorNode
                : $findMatchingParent(anchorNode, node => {
                      const parent = node.getParent()
                      return parent !== null && $isRootOrShadowRoot(parent)
                  })

        let nextBlockType = 'paragraph'
        if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType(anchorNode, ListNode)
            nextBlockType = parentList
                ? parentList.getListType()
                : element.getListType()
        } else if ($isHeadingNode(element)) {
            nextBlockType = element.getTag()
        } else if ($isQuoteNode(element)) {
            nextBlockType = 'quote'
        } else if ($isCodeNode(element)) {
            nextBlockType = 'code'
        }
        setBlockType(nextBlockType)

        setIsLink($findMatchingParent(anchorNode, $isLinkNode) != null)
        setIsInTable(
            $findMatchingParent(anchorNode, $isTableCellNode) != null
        )
    }, [])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(updateToolbar)
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateToolbar()
                    return false
                },
                COMMAND_PRIORITY_CRITICAL
            )
        )
    }, [editor, updateToolbar])

    const formatText = format => event => {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
    }

    const toggleBlock = (type, createNode) => event => {
        event.preventDefault()
        editor.update(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return
            $setBlocksType(selection, () =>
                blockType === type ? $createParagraphNode() : createNode()
            )
        })
    }

    const toggleList = (type, command) => event => {
        event.preventDefault()
        if (blockType === type) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        } else {
            editor.dispatchCommand(command, undefined)
        }
    }

    const onClickLink = async event => {
        event.preventDefault()
        let text = ''
        let href = ''
        editor.getEditorState().read(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return
            text = selection.getTextContent()
            const linkParent = $findMatchingParent(
                selection.anchor.getNode(),
                $isLinkNode
            )
            if (linkParent) {
                href = linkParent.getURL()
                text = linkParent.getTextContent()
            }
        })
        try {
            const result = await modalRef.current.show(text, href)
            if (result?.href) applyLink(result)
        } catch {
            // modal canceled
        }
        editor.focus()
    }

    function applyLink({ href, text }) {
        let needsToggle = false
        editor.update(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return
            const linkParent = $findMatchingParent(
                selection.anchor.getNode(),
                $isLinkNode
            )
            if (linkParent) {
                linkParent.setURL(href)
                if (text && text !== linkParent.getTextContent()) {
                    linkParent.clear()
                    linkParent.append($createTextNode(text))
                }
            } else if (selection.isCollapsed()) {
                const link = $createWikiLinkNode(href)
                link.append($createTextNode(text || href))
                selection.insertNodes([link])
            } else {
                needsToggle = true
            }
        })
        if (needsToggle) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, href)
        }
    }

    const onClickImage = async event => {
        event.preventDefault()
        if (window.gapi && window.google) {
            try {
                const src = await getImage(apiKey)
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src })
            } catch (err) {
                if (err.message === 'cancel') console.log('Picker canceled')
            }
        } else {
            const src = window.prompt('Enter the URL of the image:')
            if (!src) return
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src })
        }
        editor.focus()
    }

    const onClickDrive = async event => {
        event.preventDefault()
        if (!(window.gapi && window.google)) return
        try {
            const doc = await getDocument(apiKey)
            editor.update(() => {
                const selection = $getSelection()
                if (!$isRangeSelection(selection)) return
                const link = $createWikiLinkNode(doc.href)
                link.append($createTextNode(doc.name))
                selection.insertNodes([link])
            })
        } catch (err) {
            if (err.message === 'cancel') console.log('Picker canceled')
        }
        editor.focus()
    }

    const tableAction = action => event => {
        event.preventDefault()
        if (action === 'insertTable') {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                columns: '3',
                rows: '3',
                includeHeaders: { columns: false, rows: true },
            })
            return
        }
        editor.update(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) return
            const cellNode = $findMatchingParent(
                selection.anchor.getNode(),
                $isTableCellNode
            )
            if (!cellNode) return

            switch (action) {
                case 'removeTable':
                    $getTableNodeFromLexicalNodeOrThrow(cellNode).remove()
                    break
                case 'insertColumn':
                    $insertTableColumnAtSelection(true)
                    break
                case 'removeColumn':
                    $deleteTableColumnAtSelection()
                    break
                case 'insertRow':
                    $insertTableRowAtSelection(true)
                    break
                case 'removeRow':
                    $deleteTableRowAtSelection()
                    break
                case 'toggleTableHeaders': {
                    const table =
                        $getTableNodeFromLexicalNodeOrThrow(cellNode)
                    const firstRow = table.getFirstChild()
                    if (!$isTableRowNode(firstRow)) break
                    const cells = firstRow
                        .getChildren()
                        .filter($isTableCellNode)
                    const isHeader = cells.every(
                        cell =>
                            cell.__headerState === TableCellHeaderStates.ROW
                    )
                    cells.forEach(cell => {
                        cell.setHeaderStyles(
                            isHeader
                                ? TableCellHeaderStates.NO_STATUS
                                : TableCellHeaderStates.ROW,
                            TableCellHeaderStates.ROW
                        )
                    })
                    break
                }
                default:
            }
        })
    }

    return (
        <>
            <EditorToolbar>
                <ToggleButtonGroup style={{ marginRight: '1rem' }}>
                    <ToolbarButton
                        active={blockType === 'h2'}
                        onMouseDown={toggleBlock('h2', () =>
                            $createHeadingNode('h2')
                        )}
                        title="Heading 2"
                        value="h2"
                    >
                        <FormatHeader2Icon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={blockType === 'h3'}
                        onMouseDown={toggleBlock('h3', () =>
                            $createHeadingNode('h3')
                        )}
                        title="Heading 3"
                        value="h3"
                    >
                        <FormatHeader3Icon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={blockType === 'quote'}
                        onMouseDown={toggleBlock('quote', $createQuoteNode)}
                        title="Quote"
                        value="quote"
                    >
                        <FormatQuoteCloseIcon style={ICON_STYLE} />
                    </ToolbarButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup style={{ marginRight: '1rem' }}>
                    <ToolbarButton
                        active={formats.bold}
                        onMouseDown={formatText('bold')}
                        title="Bold (Ctrl+B)"
                        value="bold"
                    >
                        <FormatBoldIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={formats.italic}
                        onMouseDown={formatText('italic')}
                        title="Italic (Ctrl+I)"
                        value="italic"
                    >
                        <FormatItalicIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={formats.underline}
                        onMouseDown={formatText('underline')}
                        title="Underline (Ctrl+U)"
                        value="underline"
                    >
                        <FormatUnderlineIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={formats.strikethrough}
                        onMouseDown={formatText('strikethrough')}
                        title="Strikethrough"
                        value="strikethrough"
                    >
                        <FormatStrikethroughIcon style={{ height: 16 }} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={formats.code}
                        onMouseDown={formatText('code')}
                        title="Inline code"
                        value="code"
                    >
                        <CodeTagsIcon style={ICON_STYLE} />
                    </ToolbarButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup style={{ marginRight: '1rem' }}>
                    <ToolbarButton
                        active={isLink}
                        onMouseDown={onClickLink}
                        title="Link"
                        value="link"
                    >
                        <LinkIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={false}
                        onMouseDown={onClickImage}
                        title="Image"
                        value="image"
                    >
                        <ImageIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={false}
                        onMouseDown={onClickDrive}
                        title="Google Drive file"
                        value="drive"
                    >
                        <GoogleDriveIcon style={ICON_STYLE} />
                    </ToolbarButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup style={{ marginRight: '1rem' }}>
                    <ToolbarButton
                        active={blockType === 'bullet'}
                        onMouseDown={toggleList(
                            'bullet',
                            INSERT_UNORDERED_LIST_COMMAND
                        )}
                        title="Bulleted list"
                        value="bullet"
                    >
                        <FormatListBulletedIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={blockType === 'number'}
                        onMouseDown={toggleList(
                            'number',
                            INSERT_ORDERED_LIST_COMMAND
                        )}
                        title="Numbered list"
                        value="number"
                    >
                        <FormatListNumberedIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={blockType === 'check'}
                        onMouseDown={toggleList(
                            'check',
                            INSERT_CHECK_LIST_COMMAND
                        )}
                        title="Check list"
                        value="check"
                    >
                        <FormatListChecksIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    <ToolbarButton
                        active={blockType === 'code'}
                        onMouseDown={toggleBlock('code', () =>
                            $createCodeNode()
                        )}
                        title="Code block"
                        value="codeblock"
                    >
                        <CodeBracesIcon style={ICON_STYLE} />
                    </ToolbarButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup>
                    <ToolbarButton
                        active={false}
                        onMouseDown={tableAction('insertTable')}
                        title="Insert table"
                        value="insertTable"
                    >
                        <TableLargeIcon style={ICON_STYLE} />
                    </ToolbarButton>
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('removeTable')}
                            title="Remove table"
                            value="removeTable"
                        >
                            <TableLargeRemoveIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('insertColumn')}
                            title="Insert column"
                            value="insertColumn"
                        >
                            <TableColumnPlusAfterIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('removeColumn')}
                            title="Remove column"
                            value="removeColumn"
                        >
                            <TableColumnRemoveIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('insertRow')}
                            title="Insert row"
                            value="insertRow"
                        >
                            <TableRowPlusAfterIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('removeRow')}
                            title="Remove row"
                            value="removeRow"
                        >
                            <TableRowRemoveIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                    {isInTable && (
                        <ToolbarButton
                            active={false}
                            onMouseDown={tableAction('toggleTableHeaders')}
                            title="Toggle header row"
                            value="toggleTableHeaders"
                        >
                            <PageLayoutHeaderIcon style={ICON_STYLE} />
                        </ToolbarButton>
                    )}
                </ToggleButtonGroup>
            </EditorToolbar>
            <LinkModal ref={modalRef} items={items} />
        </>
    )
}
