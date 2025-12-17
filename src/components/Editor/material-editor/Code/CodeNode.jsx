import React from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-typescript'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, Select, MenuItem } from '@material-ui/core'

import './Code.css'

const useLanguages = {
    none: '',
    bash: 'Bash',
    clike: 'C, C#, C++',
    css: 'CSS',
    html: 'HTML',
    java: 'Java',
    js: 'JavaScript',
    php: 'PHP',
    powershell: 'Powershell',
    python: 'Python',
    ruby: 'Ruby',
    typescript: 'TypeScript',
    xml: 'XML',
}
const useStyles = makeStyles(theme => ({
    select: {
        fontSize: '1rem',
        '&:before': {
            content: 'none',
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
        '& select:focus': {
            backgroundColor: '#e8f0fe',
        },
        '& .MuiOutlinedInput-input': {
            boxSizing: 'border-box',
            minWidth: 140,
            padding: '.5rem 3rem .5rem 1rem',
        },
    },
}))

/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

export function CodeBlock(props) {
    const classes = useStyles()
    const { editor, node, isFocused } = props
    const language = node.data.get('language')
        ? node.data.get('language')
        : 'none'

    function onChange(event) {
        editor.setNodeByKey(node.key, {
            data: { language: event.target.value },
        })
    }

    return (
        <div style={{ position: 'relative' }}>
            <pre className="code">
                <code {...props.attributes}>{props.children}</code>
            </pre>
            <Paper
                elevation={2}
                contentEditable={false}
                style={{
                    alignItems: 'center',
                    background: 'white',
                    border: '1px solid lightgrey',
                    bottom: -48,
                    // cursor: 'default',
                    display: isFocused ? 'inline-flex' : 'none',
                    // minWidth: 200,
                    padding: 5,
                    position: 'absolute',
                    right: 0,
                    userSelect: 'none',
                    zIndex: 1,
                }}
            >
                <Select
                    className={classes.select}
                    onChange={onChange}
                    value={language}
                    variant="outlined"
                >
                    {Object.entries(useLanguages).map(entry => (
                        <MenuItem key={entry[0]} value={entry[0]}>
                            {entry[1]}
                        </MenuItem>
                    ))}
                </Select>
            </Paper>
        </div>
    )
}

export function CodeBlockLine(props) {
    return <div {...props.attributes}>{props.children}</div>
}

/**
 * Render a Slate decoration.
 *
 * @param {Object} props
 * @return {Element}
 */

export const renderDecoration = (props, editor, next) => {
    const { children, decoration, attributes } = props

    switch (decoration.type) {
        case 'comment':
            return (
                <span {...attributes} style={{ opacity: '0.33' }}>
                    {children}
                </span>
            )
        case 'keyword':
            return (
                <span {...attributes} style={{ color: '#1d55ec' }}>
                    {children}
                </span>
            )
        case 'string':
        case 'operator':
            return (
                <span
                    {...attributes}
                    style={{ fontStyle: 'italic', color: '#34a853' }}
                >
                    {children}
                </span>
            )

        case 'tag':
            return (
                <span
                    {...attributes}
                    style={{ fontStyle: 'italic', color: '#ea4335' }}
                >
                    {children}
                </span>
            )
        case 'punctuation':
            return (
                <span {...attributes} style={{ opacity: '0.75' }}>
                    {children}
                </span>
            )
        default:
            return next()
    }
}

/**
 * Decorate code blocks with Prism.js highlighting.
 *
 * @param {Node} node
 * @return {Array}
 */

export const decorateNode = (node, editor, next) => {
    const others = next() || []
    if (node.type !== 'code') return others
    const language = node.data.get('language')
    if (!language || language === 'none') return others
    const texts = Array.from(node.texts())
    const string = texts.map(([n]) => n.text).join('\n')
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    const decorations = []
    let startEntry = texts.shift()
    let endEntry = startEntry
    let startOffset = 0
    let endOffset = 0
    let start = 0

    // eslint-disable-next-line
    for (const token of tokens) {
        startEntry = endEntry
        startOffset = endOffset

        const [startText, startPath] = startEntry
        const content = getContent(token)
        // To fix highlighting problems
        // const newlines = content.split('\n').length - 1
        const length = content.length //- newlines
        const end = start + length

        let available = startText.text.length - startOffset
        let remaining = length

        endOffset = startOffset + remaining

        while (available < remaining && texts.length > 0) {
            endEntry = texts.shift()
            const [endText] = endEntry
            remaining = length - available
            available = endText.text.length
            endOffset = remaining
        }

        const [endText, endPath] = endEntry

        if (typeof token !== 'string') {
            const dec = {
                type: token.type,
                anchor: {
                    key: startText.key,
                    path: startPath,
                    offset: startOffset,
                },
                focus: {
                    key: endText.key,
                    path: endPath,
                    offset: endOffset,
                },
            }

            decorations.push(dec)
        }

        start = end
    }

    return [...others, ...decorations]
}

/**
 * A helper function to return the content of a Prism `token`.
 *
 * @param {Object} token
 * @return {String}
 */

function getContent(token) {
    if (typeof token === 'string') {
        return token
    } else if (typeof token.content === 'string') {
        return token.content
    } else {
        return token.content.map(getContent).join('')
    }
}
