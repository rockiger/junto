// @ts-nocheck
import AccountMultipleOutlineIcon from 'mdi-react/AccountMultipleOutlineIcon'
import ArchiveOutlineIcon from 'mdi-react/ArchiveOutlineIcon'
import StarIcon from 'mdi-react/StarOutlineIcon'
import HomeIcon from 'mdi-react/HomeOutlineIcon'

import { isMobileDevice } from 'lib/helper'
import { SidebarSharedDrives } from './SidebarSharedDrives'
import { SidebarTree } from './SidebarTree'
import { SidebarItem } from './SidebarItem'

window.isMobileDevice = isMobileDevice

const SidebarRenderer = () => {
    return (
        <>
            <SidebarItem
                icon={HomeIcon}
                name="Home"
                path="/home"
                tooltip="Your home page"
                className="mt-4"
            />
            <div>
                <div
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
                        icon={AccountMultipleOutlineIcon}
                        name="Shared with me"
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
