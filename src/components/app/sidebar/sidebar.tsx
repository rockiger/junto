import React from 'reactn'

import SidebarContent from 'components/Sidebar'

import styles from './sidebar.module.scss'

export default function Sidebar(props: any) {
    return (
        <div className={styles.Sidebar}>
            <SidebarContent />
        </div>
    )
}
