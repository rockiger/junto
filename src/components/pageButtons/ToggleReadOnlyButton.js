import React from 'react'

import ContentSaveIcon from 'mdi-react/ContentSaveIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from './Button'
import { toKeyName } from 'is-hotkey'

import styles from './toggle-read-only-button.module.scss'

const modifier = toKeyName('mode') === 'meta' ? '⌘' : 'Ctrl'

export const ToggleReadOnlyButton = props => {
    const { onClick, readOnly, style, type } = props
    return (
        <Button
            className={styles.ToggleReadOnlyButton}
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
