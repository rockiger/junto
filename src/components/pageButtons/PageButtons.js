import React from 'react'

import styles from './PageButtons.module.css'

export function PageButtons(props) {
    return (
        <div id="pageButtons" className={styles.pageButtons}>
            {props.children}
        </div>
    )
}
