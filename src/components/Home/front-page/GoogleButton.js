import React from 'react'

import GoogleIcon from 'components/googleIcon'

import styles from './google-button.module.scss'

export const GoogleButton = () => (
    <div
        className={styles.GoogleButton}
        onClick={() => {
            const button = document.getElementById('authorize_button') || null
            if (button) button.click()
        }}
    >
        <div className={styles.GoogleButton_icon}>
            <GoogleIcon active="true" />
        </div>
        <div className={styles.GoogleButton_text}>Sign in with Google</div>
    </div>
)
