import React from 'react'
import classnames from 'classnames'

import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { orderedListStrategy, isOrderedList } from './ListUtils'

const OrderedListButton = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) =>
    readOnly ? null : (
        <Button
            active={isOrderedList(value)}
            style={style}
            type={type}
            onClick={e =>
                onChange(orderedListStrategy(value.change(), 'ordered-list'))
            }
            className={classnames('slate-list-plugin--button', className)}
            title={`Numbered List (${platform.controlKey()}+Shift+7)`}
        >
            <FormatListNumberedIcon />
        </Button>
    )

export default OrderedListButton
