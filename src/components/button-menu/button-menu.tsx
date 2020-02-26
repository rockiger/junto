import React from 'reactn'

import IconButton from 'components/icon-button'

import styles from './button-menu.module.scss'

export default function ButtonMenu({ children }) {
    return (
        <div>
            <IconButton ariaLabel="Sort">{children}</IconButton>
            <div className={styles.Paper}>
                <div className={styles.Paper_menuEntry}>Hilfe und Support</div>
                <div className={styles.Paper_menuEntry}>Schulungen</div>
                <div className={styles.Paper_menuEntry}>Updates</div>
            </div>
        </div>
    )
}
