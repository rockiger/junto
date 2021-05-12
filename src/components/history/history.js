import React, { Suspense, useState } from 'react'
import HistoryIcon from 'mdi-react/HistoryIcon'

import { IconButton, Modal, Spinner } from 'components/gsuite-components'

const HistoryDialog = React.lazy(() => import('./history-dialog'))

export { History }

export default function History({ fileId, loadEditorContent }) {
    const [isOpen, setIsOpen] = useState(false)

    const HistoryModal = isOpen
        ? props => (
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
                          loadEditorContent={loadEditorContent}
                      />
                  </Suspense>
              </Modal>
          )
        : null

    return {
        title: 'History',
        handler: toggle,
        icon: HistoryIcon,
        HistoryModal,
    }

    function toggle() {
        setIsOpen(!isOpen)
    }
}
