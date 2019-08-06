import React from 'react'
import classnames from 'classnames'

import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon'
import { Button } from '../../slate-editor-components/src'

import { underlineMarkStrategy, hasMark } from './UnderlineUtils'

const UnderlineButton = ({
    value,
    onChange,
    changeState,
    className,
    style,
    type,
}) => (
    <Button
        active={hasMark(value)}
        style={style}
        type={type}
        onClick={e => onChange(underlineMarkStrategy(value.change()))}
        className={classnames('slate-underline-plugin--button', className)}
    >
        <FormatUnderlineIcon />
    </Button>
)

export default UnderlineButton
