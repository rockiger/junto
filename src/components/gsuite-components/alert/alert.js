//@ts-check
import React from 'react'

import { Modal } from '../modal'

import styles from './alert.module.scss'
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
 *
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
                <Button onClick={onClose} primary={!onOk}>
                    {onOk ? cancelLabel : 'Close'}
                </Button>,
                onOk ? (
                    <Button primary onClick={onOk}>
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
