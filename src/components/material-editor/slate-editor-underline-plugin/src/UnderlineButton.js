import React from 'react'
import classnames from 'classnames'

import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import { platform } from '../../slate-editor-utils/src'
import { Button } from '../../slate-editor-components/src'

import { underlineMarkStrategy, hasMark } from './UnderlineUtils'

const UnderlineButton = ({
    value,
    onChange,
    changeState,
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
            onClick={e => onChange(underlineMarkStrategy(value.change()))}
            className={classnames('slate-underline-plugin--button', className)}
            title={`Underline (${platform.controlKey()}+U)`}
        >
            <FormatUnderlineIcon />
        </Button>
    )

export default UnderlineButton
