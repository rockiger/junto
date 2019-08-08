import React from 'react'
import classnames from 'classnames'

import FormatHeader1Icon from 'mdi-react/FormatHeader1Icon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { h1Strategy, isH1 } from './HeaderUtils'

const H1Button = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={isH1(value)}
            style={style}
            type={type}
            onClick={e => onChange(h1Strategy(value.change(), 'ordered-list'))}
            className={classnames('slate-list-plugin--button', className)}
            title={`Apply Heading 1 (${platform.controlKey()}+Alt+1)`}
        >
            <FormatHeader1Icon />
        </Button>
    )

export default H1Button
