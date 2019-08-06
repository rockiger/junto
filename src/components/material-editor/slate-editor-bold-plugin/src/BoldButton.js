import React from 'react'
import FontAwesome from 'react-fontawesome'
import classnames from 'classnames'

import FormatBoldIcon from 'mdi-react/FormatBoldIcon'

import { Button } from '../../slate-editor-components/src'
import { boldMarkStrategy, hasMark } from './BoldUtils'

const BoldButton = ({
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
            onClick={e => onChange(boldMarkStrategy(value.change()))}
            className={classnames('slate-bold-plugin--button', className)}
        >
            <FormatBoldIcon />
        </Button>
    )

export default BoldButton
