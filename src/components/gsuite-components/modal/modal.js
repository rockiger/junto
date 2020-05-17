//@ts-check
import React from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames'
import CloseIcon from 'mdi-react/CloseIcon'

import IconButton from '../icon-button'
import s from './modal.module.scss'

export { Modal }
export default Modal
/**
 * @typedef ModalProps
 * @property {any[]} [buttons]
 * @property {any} children
 * @property {function} closeModal
 * @property {boolean} isOpen
 * @property {('xs'|'sm'|'md'|'lg'|'xl'|false)} [maxWidth]
 * @property {function} onRequestClose
 * @property {string} title
 */

/**
 *
 * @param {ModalProps} props
 */
function Modal({
    buttons,
    children,
    closeModal,
    isOpen,
    maxWidth = false,
    title,
    ...rest
}) {
    ReactModal.setAppElement('#root')

    return (
        <ReactModal
            {...rest}
            isOpen={isOpen}
            contentLabel="onRequestClose Example"
            onRequestClose={closeModal}
            className={classNames(s.Modal, {
                [s[`Modal__${maxWidth}`]]: maxWidth,
            })}
            overlayClassName={s.Overlay}
        >
            <div className={s.Modal_header}>
                <div className={s.Modal_header_title}>{title}</div>
                <IconButton onClick={closeModal}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={s.Modal_sidebar}></div>
            <div className={s.Modal_content}>{children}</div>
            {buttons && <div className={s.Modal_footer}></div>}
        </ReactModal>
    )
}
