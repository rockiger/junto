import React from 'react'

import ContentSaveIcon from 'mdi-react/ContentSaveIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from './Button'
import { makeStyles } from '@material-ui/core'
import { toKeyName } from 'is-hotkey'

const modifier = toKeyName('mode') === 'meta' ? '⌘' : 'Ctrl'
const useStyles = makeStyles(theme => ({}))

export const ToggleReadOnlyButton = props => {
    const { onClick, readOnly, className, style, type } = props
    const classes = useStyles()
    return (
        <Button
            className={`${className} ${classes.root}`}
            style={style}
            type={type}
            onClick={onClick}
            readOnly={readOnly}
            title={readOnly ? `Edit (e)` : `Save (${modifier}+Enter)`}
        >
            {readOnly ? (
                <PencilOutlineIcon />
            ) : (
                <ContentSaveIcon style={{ color: '#4285f4' }} />
            )}
        </Button>
    )
}
