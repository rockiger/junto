import React from 'react'
import classnames from 'classnames'

import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { unorderedListStrategy, isUnorderedList } from './ListUtils'

const UnorderedListButton = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={isUnorderedList(value)}
            style={style}
            type={type}
            onClick={e => onChange(unorderedListStrategy(value.change()))}
            className={classnames('slate-list-plugin--button', className)}
            title={`Bulleted List (${platform.controlKey()}+Shift+8)`}
        >
            <FormatListBulletedIcon />
        </Button>
    )

export default UnorderedListButton
