//@ts-check
import React from 'react'
import ReactModal from 'react-modal'
import clsx from 'clsx'
import CloseIcon from 'mdi-react/CloseIcon'

import IconButton from '../icon-button'
import s from './modal.module.scss'

export { Modal }
export default Modal
/**
 * @typedef ModalProps
 * @property {any[]} [buttons]
 * @property {any} children
 * @property {(ev) => void} onClose
 * @property {boolean} [fullHeight=false]
 * @property {boolean} [isOpen=true]
 * @property {('xs'|'sm'|'md'|'lg'|'xl'|false)} [maxWidth]
 * @property {string} title
 */

/**
 * @param {ModalProps} props
 */
function Modal({
    buttons,
    children,
    onClose,
    fullHeight = false,
    isOpen,
    maxWidth = false,
    title,
    ...rest
}) {
    ReactModal.setAppElement('#root')

    console.log(fullHeight)
    return (
        <ReactModal
            {...rest}
            isOpen={isOpen}
            contentLabel="onRequestClose Example"
            onRequestClose={onClose}
            className={clsx(s.Modal, {
                [s.Modal__fullHeight]: fullHeight,
                [s[`Modal__${maxWidth}`]]: maxWidth,
            })}
            overlayClassName={s.Overlay}
        >
            <div className={s.Modal_header}>
                <div className={s.Modal_header_title}>{title}</div>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={s.Modal_sidebar}></div>
            <div className={s.Modal_content}>{children}</div>
            {buttons && (
                <div className={s.Modal_footer}>
                    {buttons.map((button) => button)}
                </div>
            )}
        </ReactModal>
    )
}
