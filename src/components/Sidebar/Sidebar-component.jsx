import React from 'react'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'
import ArchiveOutlineIcon from 'mdi-react/ArchiveOutlineIcon'
import CheckboxMultipleBlankIcon from 'mdi-react/CheckboxMultipleBlankOutlineIcon'
import StarIcon from 'mdi-react/StarOutlineIcon'

import { isMobileDevice } from 'lib/helper'
import { SidebarSharedDrives } from './SidebarSharedDrives'
import { SidebarTree } from './SidebarTree'
import { SidebarItem } from './SidebarItem'

import styles from './sidebar.module.scss'
import { Hint } from 'components/gsuite-components/hint'
import { clsx } from 'clsx';
window.isMobileDevice = isMobileDevice

const SidebarRenderer = props => {
    return (
        <>
            {/* {isMobileDevice() && (
                <Fab
                    arial-label="Add"
                    className={styles.fab}
                    color="secondary"
                    onClick={props.onClickNewButton}
                >
                    <AddIcon className={styles.addIcon} />
                </Fab>
            )} */}
            <div className={clsx(styles.sidebar, "mt-4")}>
                <div
                    className={styles.Sidebar_navigation}
                    id="Sidebar-Navigation"
                >
                    <SidebarTree />
                    <SidebarSharedDrives />
                    <SidebarItem
                        icon={StarIcon}
                        name="Starred"
                        path="/starred"
                        tooltip="Your starred pages"
                        className="mt-4"
                    />
                    <SidebarItem
                        icon={CheckboxMultipleBlankIcon}
                        name="Wikis"
                        path="/wikis"
                        tooltip="All wikis you can access"
                    />
                    <SidebarItem
                        icon={AccountMultipleOutlineIcon}
                        name="Shared With Me"
                        path="/shared-with-me"
                        tooltip="Pages shared with me"
                    />
                    <SidebarItem
                        icon={ArchiveOutlineIcon}
                        name="Archive"
                        path="/archive"
                        tooltip="Archived files and wikis"
                    />
                </div>
            </div>
        </>
    )
}
export default SidebarRenderer
