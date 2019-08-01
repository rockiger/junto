import React from 'react'
import classnames from 'classnames'

import LinkIcon from 'mdi-react/LinkIcon'

import { Button } from '../../slate-editor-components/src'
import { insertLinkStrategy, hasLinks } from './LinkUtils'

const LinkButton = ({
    value,
    onChange,
    className,
    outerState: { readOnly },
    style,
    type,
}) => {
    if (readOnly) return null
    return (
        <Button
            active={hasLinks(value)}
            style={style}
            type={type}
            onMouseDown={e => onChange(insertLinkStrategy(value.change()))}
            className={classnames('slate-link-plugin--button', className)}
        >
            <LinkIcon />
        </Button>
    )
}

export default LinkButton
