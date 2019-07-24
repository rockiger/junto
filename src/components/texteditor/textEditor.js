import React, { Component, Fragment } from 'react'
import { Editor, getEventTransfer } from 'slate-react'
import { Value } from 'slate'
import { isKeyHotkey } from 'is-hotkey'
import isUrl from 'is-url'
import { Beforeunload } from 'react-beforeunload';

import CodeTagsIcon from 'mdi-react/CodeTagsIcon';
import FormatBoldIcon from 'mdi-react/FormatBoldIcon';
import FormatHeader1Icon from 'mdi-react/FormatHeader1Icon';
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'
import FormatItalicIcon from 'mdi-react/FormatItalicIcon';
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon';
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon';
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon';
import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import LinkIcon from 'mdi-react/LinkIcon'

import Toolbar from './toolbar';
import ToolbarButton from './toolbarButton'
import DriveToolbarButton from './driveToolbarButton'
import LinkModal from './linkModal';
import { getFolderId, listFiles, updateFile} from '../../lib/gdrive';
import { getExtFromFilenName, getTitleFromFileName } from '../../lib/helper'
import { EXT } from '../../lib/constants'

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')
const isLinkHotkey = isKeyHotkey('mod+k')

/**
 * TextEditor Component
 *
 * @type {Component}
 */
export default class TextEditor extends Component {

    state = {
      autocompleteItems: [],
      autocompleteValue: '',
      value: Value.fromJSON(JSON.parse(this.props.initialValue)),
      isModalOpen: false,
    }

    componentDidMount() {
      this.populateAutocompletItems();
    }

    componentWillUnmount() {
      this.save();
    }

    save = async () => {
      try {
          await updateFile(
              this.props.fileId, 
              JSON.stringify(this.editor.value.toJSON())
          );
          console.log('save:', this.props.fileId);
      } catch (err) {
          console.log('save: Couldn\'t save file with id:', this.props.fileId);
          console.log('Error:', err)
      }
  };



    populateAutocompletItems = async () => {
      const folderId = await getFolderId();
      if (folderId) {
          const files = await listFiles();
          const autocompleteItems = files.filter(file => {
              const ext = getExtFromFilenName(file.name);                
              return (ext === EXT)
          })

          this.setState({ autocompleteItems });
      }
  }

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasMark = type => {
        const { value } = this.state
        return value.activeMarks.some(mark => mark.type === type)
    }

      /**
     * Check whether the current selection has a link in it.
     *
     * @return {Boolean} hasLinks
     */

    hasLinks = () => {
        const { value } = this.state
        return value.inlines.some(inline => inline.type === 'link')
    }

      /**
     * Check whether the current selection has a link in it.
     *
     * @return {String} hasLinks
     */

    getLink = () => {
        const { value } = this.state
        return value.inlines.filter(inline => inline.type === 'link').first()
    }

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */
  
    hasBlock = type => {
      const { value } = this.state
      return value.blocks.some(node => node.type === type)
    }

    /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

    ref = editor => {
        this.editor = editor
        window.editor = editor;
    }

    render() {
        return (
            <>
                <Toolbar>
                    {this.renderMarkButton('bold', FormatBoldIcon)}
                    {this.renderMarkButton('italic', FormatItalicIcon)}
                    {this.renderMarkButton('underlined', FormatUnderlineIcon)}
                    {this.renderMarkButton('code', CodeTagsIcon)}
                    {this.renderLinkButton('link', LinkIcon)}
                    <DriveToolbarButton />
                    {this.renderBlockButton('heading-one', FormatHeader1Icon)}
                    {this.renderBlockButton('heading-two', FormatHeader2Icon)}
                    {this.renderBlockButton('block-quote', FormatQuoteCloseIcon)}
                    {this.renderBlockButton('numbered-list', FormatListNumberedIcon)}
                    {this.renderBlockButton('bulleted-list', FormatListBulletedIcon)}
                </Toolbar>
                <Editor 
                    spellCheck
                    autoFocus
                    readOnly={false}
                    placeholder="Enter some rich text..."
                    ref={this.ref}
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    onPaste={this.onPaste}
                    renderBlock={this.renderBlock}
                    renderInline={this.renderInline}
                    renderMark={this.renderMark}
                    style={{ 
                      fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                      fontSize: '1rem',
                      height: 'calc(100vh - 65px - 51px)',
                      padding: '.7rem 1rem .7rem .7rem',
                      overflowY: 'auto',
                    }}
                />
                <Beforeunload onBeforeunload={() => this.save()} />
                <LinkModal
                    isModalOpen={this.state.isModalOpen}
                    onChangeAutocomplete={this.onChangeAutocomplete}
                    onClickSelectButton={this.onClickSelectButton}
                    onCloseModal={this.onCloseModal}
                    onSelectAutocomplete={this.onSelectAutocomplete}
                    autocompleteValue={this.state.autocompleteValue}
                    autocompleteItems={this.state.autocompleteItems}
                />
            </>
        )
    }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, Icon) => {
    const isActive = this.hasMark(type)

    return (
      <ToolbarButton
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
          <Icon />
      </ToolbarButton>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, Icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <ToolbarButton
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
          <Icon />
      </ToolbarButton>
    )
  }


  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderLinkButton = (type, Icon) => {
    const isActive = this.hasLinks();

    return (
      <ToolbarButton
        active={isActive}
        onMouseDown={event => this.onClickLink(event, type)}
      >
          <Icon />
      </ToolbarButton>
    )
  }

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  /**
   * Render a Slate inline.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderInline = (props, editor, next) => {
    const { attributes, children, node, readOnly } = props

    console.log('renderInline:', props)

    switch (node.type) {
      case 'link': {
        const hasLinks = this.hasLinks()
        //const hasLink = this.hasLink()
        const getLink = this.getLink()
        console.log('hasLinks:', hasLinks);
        //console.log('haskLink:', hasLink);
        console.log('getLink:', getLink);

        const {selection} = this.state.value;

        const focusedOnCurrentNode = this.getLink() && node.key === this.getLink().key
        const showTooltip = !readOnly && selection.isCollapsed && focusedOnCurrentNode
        console.log('focusedOnCurrentNode:', focusedOnCurrentNode)
        console.log('showTooltip:', showTooltip)

        const { data } = node
        const href = data.get('href')
        return (
          <span>
            {showTooltip && (
              <span style={{ 
                position: 'absolute',
                bottom: -35,
                background: 'white',
                minWidth: 275,
                border: '1px solid lightgrey',
                padding: 5
                }}>
                  <span>Icon</span>
                  <a 
                    href={href} 
                    alt={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => window.open(href, '_blank')}>
                      {href}
                  </a>
                  <span onClick={(ev) => copyToClipboard(href)}>
                    Copy
                  </span>
                  <span onClick={ev => window.prompt('Enter the URL of the link:', href)}>
                    Edit
                  </span>
                  <span onClick={ ev => editor.command(unwrapLink).focus() }>Remove</span>
                </span>
            )}
            <a {...attributes} href={href}>
              {children}
            </a>
          </span>
        )
      }

      default: {
        return next()
      }
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onChangeAutocomplete = ev => this.setState({ autocompleteValue: ev.target.value })

  onClickSelectButton = (ev) => {
    console.log('onClickSelecButton:', this.state.autocompleteValue)
    const href = this.state.autocompleteValue;
    const newState = { isModalOpen: false, autocompleteValue: '' };
    this.wrapLinkAndsetState(newState, href)
}

  wrapLinkAndsetState(newState, href, text='') {
    if (this.editor.value.selection.isExpanded) {
      this.setState(
        newState,
        () => this.editor.command(wrapLink, href),
      )
    } else {
      const linktext = text ? text : href;
      this.setState(
        newState,
        () => this.editor
          .insertText(linktext)
          .moveFocusBackward(linktext.length)
          .command(wrapLink, href)
      )
    }
  }

  onCloseModal = () => {
    this.setState({ isModalOpen: false })
}


onSelectAutocomplete = (val) => {
  // TODO
  const href = `/page/${val}`
  const newState = { isModalOpen: false, autocompleteValue: '' };
  const filename = this.state.autocompleteItems.find(el => el.id === val).name
  const text = getTitleFromFileName(filename)
  console.log('onSelectAutocomplete', text);
  this.wrapLinkAndsetState(newState, href, text)
}

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else if (isLinkHotkey(event)) {
        event.preventDefault()
        this.toggleLink()
        return
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }

    /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   */

  onClickLink = (event, type='link') => {
    event.preventDefault()
    this.toggleLink(type);
  }

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onPaste = (event, editor, next) => {
    if (editor.value.selection.isCollapsed) return next()

    const transfer = getEventTransfer(event)
    const { type, text } = transfer
    if (type !== 'text' && type !== 'html') return next()
    if (!isUrl(text)) return next()

    if (this.hasLinks()) {
      editor.command(unwrapLink)
    }

    editor.command(wrapLink, text)
  }

  toggleLink = (type='link') => {
    if (type !== 'link') return // do something in the future

    const { editor } = this
    const { value } = editor
    const hasLinks = this.hasLinks()

    if (hasLinks) {
      editor.command(unwrapLink)
    } else {

      // add only url
      // const href = window.prompt()
      // editor.command(wrapLink, href)
      this.setState({ isModalOpen: true });
    }
  }
}

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
 * @param {String} href
 */

function wrapLink(editor, href) {
    editor.wrapInline({
      type: 'link',
      data: { href },
    })
  
    editor.moveToEnd()
  }

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */

function unwrapLink(editor) {
    editor.unwrapInline('link')
  }

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };