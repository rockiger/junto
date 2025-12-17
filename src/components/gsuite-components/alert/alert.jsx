//@ts-check
import React from 'react'

import { Modal } from '../modal'

import Button from '../button'

export { Alert }

/**
 * @typedef AlertExtraProps
 * @property {string} [cancelLabel]
 * @property {(ev) => void} onClose
 * @property {(ev) => void} [onOk]
 * @property {string} [okLabel]
 */

/**
 * @param {import('../modal/modal').ModalProps & AlertExtraProps} props
 */
export default function Alert({
    cancelLabel = 'Cancel',
    children,
    maxWidth = 'xs',
    okLabel = 'Ok',
    onClose,
    onOk,
    ...rest
}) {
    return (
        <Modal
            {...rest}
            buttons={[
                <Button key="close" onClick={onClose} primary={!onOk}>
                    {onOk ? cancelLabel : 'Close'}
                </Button>,
                onOk ? (
                    <Button key="ok" primary onClick={onOk}>
                        {okLabel}
                    </Button>
                ) : null,
            ]}
            maxWidth={maxWidth}
            onClose={onClose}
        >
            {children}
        </Modal>
    )
}

/**
 * @typedef AlertType
 * @property {string} buttonText
 * @property {React.ReactNode} content
 * @property {boolean} isOpen
 * @property {() => void} onOk
 * @property {string} title
 */

/** @type {AlertType} */
export const emptyAlert = {
    buttonText: '',
    content: '',
    isOpen: false,
    onOk: () => {},
    title: '',
}
