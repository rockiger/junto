import React from 'react'
import DotsVerticalIcon from 'mdi-react/DotsVerticalIcon'

import { useArchiveMenuEntry } from 'components/archive/archive-menu-entry' //! rename
import { ButtonMenu } from 'components/ButtonMenu'
import { useHistoryMenu } from 'components/history/history'
import { useShareMenuItem } from './ShareMenuItem'

export function PageMenu({ fileId }) {
    const archiveMenuEntry = useArchiveMenuEntry({ fileId })
    const { ArchiveAlert } = archiveMenuEntry
    const historyItem = useHistoryMenu({ fileId })
    const { HistoryModal } = historyItem
    const shareButton = useShareMenuItem({ fileId })
    return (
        <ButtonMenu
            items={[
                {
                    key: 1,
                    name: archiveMenuEntry.title,
                    handler: archiveMenuEntry.handler,
                    icon: archiveMenuEntry.icon,
                },
                {
                    key: 2,
                    name: historyItem.title,
                    handler: historyItem.handler,
                    icon: historyItem.icon,
                },
                {
                    key: 3,
                    name: shareButton.title,
                    handler: shareButton.handler,
                    icon: shareButton.icon,
                },
            ]}
        >
            <DotsVerticalIcon />
            {ArchiveAlert && <ArchiveAlert />}
            {HistoryModal && <HistoryModal />}
        </ButtonMenu>
    )
}
