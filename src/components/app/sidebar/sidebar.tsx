import React, { useGlobal } from 'reactn'
import clsx from 'clsx'

import SidebarContent from 'components/Sidebar'

import styles from './sidebar.module.scss'

export default function Sidebar(props: any) {
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useGlobal(
        'showSidebarOnMobile'
    )
    return (
        <>
            <div
                className={clsx(
                    styles.Sidebar_overlay,
                    showSidebarOnMobile && styles.Sidebar_overlay__show
                )}
                onClick={() => setShowSidebarOnMobile(false)}
            />
            <div
                className={clsx(
                    styles.Sidebar,
                    showSidebarOnMobile && styles.Sidebar__show
                )}
            >
                <SidebarContent />
            </div>
        </>
    )
}
