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
            <div className={styles.sidebar}>
                {!isMobileDevice() && (
                    <Hint id="new_page" scope="dashboard">
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
                    </Hint>
                )}

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
