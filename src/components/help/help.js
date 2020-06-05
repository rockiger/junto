import React, { Suspense, useState } from 'react'
import HelpIcon from 'mdi-react/HelpCircleOutlineIcon'

import { IconButton, Modal, Spinner } from 'components/gsuite-components'

const HelpDialog = React.lazy(() => import('./help-dialog'))

export { Help }

export default function Help(props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton id="HelpButton" onClick={toggle} selected={isOpen}>
                <HelpIcon />
            </IconButton>
            {isOpen && (
                <Modal
                    onClose={() => setIsOpen(false)}
                    isOpen={isOpen}
                    fullHeight
                    maxWidth="lg"
                    title="Help"
                >
                    <Suspense
                        fallback={
                            <div>
                                <Spinner />
                            </div>
                        }
                    >
                        <HelpDialog isOpen={isOpen} setIsOpen={setIsOpen} />
                    </Suspense>
                </Modal>
            )}
        </>
    )

    function toggle() {
        setIsOpen(!isOpen)
    }
}
