import React from 'react'

import StarIcon from 'mdi-react/StarIcon'
import StarOutlineIcon from 'mdi-react/StarOutlineIcon'

import { Button } from './Button'

import styles from './toggle-read-only-button.module.scss'

export const ToggleStarredButton = props => {
    const { onClick, isStarred, style, type } = props
    return (
        <Button
            className={styles.ToggleReadOnlyButton}
            style={style}
            type={type}
            onClick={onClick}
            title={isStarred ? `Unstar (f)` : `Star (f)`}
        >
            {isStarred ? (
                <StarIcon style={{ color: '#fbbc05' }} />
            ) : (
                <StarOutlineIcon />
            )}
        </Button>
    )
}
