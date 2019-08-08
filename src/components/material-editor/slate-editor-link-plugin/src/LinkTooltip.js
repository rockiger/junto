import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Link } from '@material-ui/core'

import ContentCopyIcon from 'mdi-react/ContentCopyIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'
import LinkOffIcon from 'mdi-react/LinkOffIcon'
import EarthIcon from 'mdi-react/EarthIcon'

import Logo from '../../../logo'
import { Button as ToolbarButton } from '../../slate-editor-components/src'

const LinkTooltip = props => {
    return (
        <Paper
            elevation={2}
            contentEditable={false}
            style={{
                alignItems: 'center',
                background: 'white',
                border: '1px solid lightgrey',
                bottom: -40,
                cursor: 'default',
                display: props.show ? 'inline-flex' : 'none',
                left: -1,
                minWidth: 275,
                padding: 5,
                position: 'absolute',
                userSelect: 'none',
                zIndex: 1,
            }}
        >
            {props.href.startsWith('/page/') ? (
                <Logo style={{ height: 18, width: 18 }} />
            ) : (
                <EarthIcon style={{ height: 18, width: 18 }} />
            )}
            <a
                href={props.href}
                alt={props.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => window.open(props.href, '_blank')}
                style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '.9rem',
                    fontWeight: 500,
                    letterSpacing: 0.3,
                    margin: '.1rem 8px 0',
                    width: 180,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {props.href}
            </a>
            <ToolbarButton
                onMouseDown={props.onClickCopy}
                style={{ height: 30, width: 30 }}
            >
                <ContentCopyIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>

            <ToolbarButton
                onMouseDown={props.onClickEdit}
                style={{ height: 30, width: 30 }}
            >
                <PencilOutlineIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>
            <ToolbarButton
                onMouseDown={props.onClickRemove}
                style={{ height: 30, width: 30 }}
            >
                <LinkOffIcon style={{ height: 18, width: 18 }} />
            </ToolbarButton>
        </Paper>
    )
}
LinkTooltip.propTypes = {
    href: PropTypes.string.isRequired,
    onClickCopy: PropTypes.func.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    show: PropTypes.bool,
}
Link.defaultProps = {
    show: false,
}

export default LinkTooltip
