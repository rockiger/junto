import React from 'react'
import classnames from 'classnames'
import FontAwesome from 'react-fontawesome'

import FormatAlignCenterIcon from 'mdi-react/FormatAlignCenterIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { alignmentMarkStrategy, hasMark, getMark } from './AlignmentUtils'

const AlignmentCenterButton = ({
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
                hasMark(value) && getMark(value).data.get('align') === 'center'
            }
            style={style}
            type={type}
            onClick={e =>
                onChange(alignmentMarkStrategy(value.change(), 'center'))
            }
            className={classnames('slate-alignment-plugin--button', className)}
            title={`Center Align (${platform.controlKey()}+Shift+C)`}
        >
            <FormatAlignCenterIcon />
        </Button>
    )

export default AlignmentCenterButton
