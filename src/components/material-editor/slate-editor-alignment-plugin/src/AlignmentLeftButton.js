import React from 'react'
import classnames from 'classnames'

import FormatAlignLeftIcon from 'mdi-react/FormatAlignLeftIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { alignmentMarkStrategy, hasMark, getMark } from './AlignmentUtils'

const AlignmentLeftButton = ({
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
            active={
                hasMark(value) && getMark(value).data.get('align') === 'left'
            }
            style={style}
            type={type}
            onClick={e =>
                onChange(alignmentMarkStrategy(value.change(), 'left'))
            }
            className={classnames('slate-alignment-plugin--button', className)}
            title={`Left Align (${platform.controlKey()}+Shift+L)`}
        >
            <FormatAlignLeftIcon />
        </Button>
    )

export default AlignmentLeftButton
