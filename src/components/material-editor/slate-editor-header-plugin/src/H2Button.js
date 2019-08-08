import React from 'react'
import classnames from 'classnames'

import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { h2Strategy, isH2 } from './HeaderUtils'

const H2Button = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={isH2(value)}
            style={style}
            type={type}
            onClick={e => onChange(h2Strategy(value.change(), 'ordered-list'))}
            className={classnames('slate-list-plugin--button', className)}
            title={`Apply Heading 2 (${platform.controlKey()}+Alt+2)`}
        >
            <FormatHeader2Icon />
        </Button>
    )

export default H2Button
