import React, { Suspense, useState } from 'react'
import HistoryIcon from 'mdi-react/HistoryIcon'

import { IconButton, Modal, Spinner } from 'components/gsuite-components'

const HistoryDialog = React.lazy(() => import('./history-dialog'))

export { History }

export default function History({ fileId }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton
                id="HistoryButton"
                onClick={toggle}
                selected={isOpen}
                tooltip="Show History"
            >
                <HistoryIcon />
            </IconButton>
            {isOpen && (
                <Modal
                    onClose={() => setIsOpen(false)}
                    isOpen={isOpen}
                    maxWidth="sm"
                    title="Manage versions"
                >
                    <Suspense
                        fallback={
                            <div>
                                <Spinner />
                            </div>
                        }
                    >
                        <HistoryDialog
                            fileId={fileId}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </Suspense>
                </Modal>
            )}
        </>
    )

    function toggle() {
        setIsOpen(!isOpen)
    }
}
