import React, { ReactElement } from 'react'

import { Footer as FooterMenu } from 'components/staticPages'

import styles from './footer.module.scss'

export default function Footer(props: any): ReactElement {
    return (
        <footer className={styles.Footer}>
            <FooterMenu />
        </footer>
    )
}
