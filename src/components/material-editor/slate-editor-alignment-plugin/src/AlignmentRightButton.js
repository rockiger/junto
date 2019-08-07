import React from 'react'
import classnames from 'classnames'

import FormatAlignRightIcon from 'mdi-react/FormatAlignRightIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { alignmentMarkStrategy, hasMark, getMark } from './AlignmentUtils'

const AlignmentRightButton = ({
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
                hasMark(value) && getMark(value).data.get('align') === 'right'
            }
            style={style}
            type={type}
            onClick={e =>
                onChange(alignmentMarkStrategy(value.change(), 'right'))
            }
            className={classnames('slate-alignment-plugin--button', className)}
            title={`Right Align (${platform.controlKey()}+Shift+R)`}
        >
            <FormatAlignRightIcon />
        </Button>
    )

export default AlignmentRightButton
