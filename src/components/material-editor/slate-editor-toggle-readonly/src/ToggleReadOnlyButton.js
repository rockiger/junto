import React from 'react'

import ContentSaveIcon from 'mdi-react/ContentSaveIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'
import { makeStyles } from '@material-ui/core'
import { isMobileDevice } from '../../../../lib/helper'

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}))

const ToggleReadOnlyButton = props => {
    const {
        value,
        outerState: { readOnly },
        changeState,
        className,
        save,
        style,
        type,
    } = props
    const classes = useStyles()
    return isMobileDevice() ? null : (
        <Button
            className={`${className} ${classes.root}`}
            style={style}
            type={type}
            onClick={ev => {
                if (!readOnly) save()
                changeState({ value, readOnly: !readOnly })
                if (readOnly) window.editorRef.current.focus()
            }}
            readOnly={readOnly}
            title={
                readOnly ? `Edit (e)` : `Save (${platform.controlKey()}+Enter)`
            }
        >
            {readOnly ? (
                <PencilOutlineIcon />
            ) : (
                <ContentSaveIcon style={{ color: '#4285f4' }} />
            )}
        </Button>
    )
}

export default ToggleReadOnlyButton
