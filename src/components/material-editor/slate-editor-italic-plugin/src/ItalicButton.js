import React from 'react'
import classnames from 'classnames'

import FormatItalicIcon from 'mdi-react/FormatItalicIcon'

import { Button } from '../../slate-editor-components/src'

import { italicMarkStrategy, hasMark } from './ItalicUtils'

const ItalicButton = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={hasMark(value)}
            style={style}
            type={type}
            onClick={e => onChange(italicMarkStrategy(value.change()))}
            className={classnames('slate-italic-plugin--button', className)}
        >
            <FormatItalicIcon />
        </Button>
    )

export default ItalicButton
