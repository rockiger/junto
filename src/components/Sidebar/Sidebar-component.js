import React from 'react'
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'
import ArchiveOutlineIcon from 'mdi-react/ArchiveOutlineIcon'

import { isMobileDevice } from 'lib/helper'
import { SidebarSharedDrives } from './SidebarSharedDrives'
import { SidebarTree } from './SidebarTree'
import { SidebarItem } from './SidebarItem'

import styles from './sidebar.module.scss'
window.isMobileDevice = isMobileDevice

const SidebarRenderer = (props) => {
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
            <div className={styles.sidebar}>
                {!isMobileDevice() && (
                    <div
                        className={styles.Sidebar_newButton}
                        onClick={props.onClickNewButton}
                    >
                        <svg
                            className={styles.svg}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                        </svg>
                        New Page
                    </div>
                )}

                <div
                    className={styles.Sidebar_navigation}
                    id="Sidebar-Navigation"
                >
                    <SidebarTree />
                    <SidebarSharedDrives />
                    <SidebarItem
                        icon={AccountMultipleOutlineIcon}
                        name="Shared With Me"
                        path="/shared-with-me"
                        tooltip="Files shared with me"
                    />
                    <SidebarItem
                        icon={ArchiveOutlineIcon}
                        name="Archive"
                        path="/archive"
                        tooltip="Archived files"
                    />
                </div>
            </div>
        </>
    )
}
export default SidebarRenderer
