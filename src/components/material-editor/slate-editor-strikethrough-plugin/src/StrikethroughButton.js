import React from 'react'
import classnames from 'classnames'

import FormatStrikethroughIcon from 'mdi-react/FormatStrikethroughVariantIcon'

import { platform } from '../../slate-editor-utils/src'
import { Button } from '../../slate-editor-components/src'
import { strikethroughMarkStrategy, hasMark } from './StrikethroughUtils'

const StrikethroughButton = ({
    value,
    onChange,
    changeState,
    outerState: { readOnly },
    className,
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={hasMark(value)}
            style={style}
            type={type}
            onClick={e => onChange(strikethroughMarkStrategy(value.change()))}
            className={classnames(
                'slate-strikethrough-plugin--button',
                className
            )}
            title={`Strike Through (${platform.controlKey()}+Shift+S)`}
        >
            <FormatStrikethroughIcon style={{ height: 20 }} />
        </Button>
    )

export default StrikethroughButton
