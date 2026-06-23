import CloseIcon from 'mdi-react/CloseIcon'
import type { ReactNode } from 'react'
import {
    Button,
    Dialog,
    Heading,
    Modal,
    ModalOverlay,
    type ModalOverlayProps,
} from 'react-aria-components'

const maxWidthClassName = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
} as const

export type DialogModalMaxWidth = keyof typeof maxWidthClassName

export interface DialogModalRenderProps {
    close: () => void
}

export interface DialogModalProps {
    isOpen: boolean
    title: ReactNode
    children: ReactNode | ((props: DialogModalRenderProps) => ReactNode)
    onOpenChange?: (isOpen: boolean) => void
    onClose?: () => void
    maxWidth?: DialogModalMaxWidth
    className?: string
    contentClassName?: string
    isDismissable?: ModalOverlayProps['isDismissable']
}

export function DialogModal({
    isOpen,
    title,
    children,
    onOpenChange,
    onClose,
    maxWidth = '2xl',
    className,
    contentClassName,
    isDismissable = true,
}: DialogModalProps) {
    const handleOpenChange = (open: boolean) => {
        onOpenChange?.(open)
        if (!open) onClose?.()
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            isDismissable={isDismissable}
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4"
        >
            <Modal
                className={`w-full ${maxWidthClassName[maxWidth]} rounded-lg bg-surface-container shadow-lg outline-none ${className ?? ''}`}
            >
                <Dialog className="flex max-h-[min(90vh,48rem)] flex-col outline-none">
                    {({ close }) => (
                        <>
                            <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
                                <Heading
                                    slot="title"
                                    className="text-xl font-medium text-heading"
                                >
                                    {title}
                                </Heading>
                                <Button
                                    slot="close"
                                    onPress={close}
                                    aria-label="Close"
                                    className="rounded-full p-2 outline-none transition-[color,background] duration-200 hover:bg-surface-hover data-focus-visible:shadow-focus"
                                >
                                    <CloseIcon className="h-5 w-5" />
                                </Button>
                            </div>
                            <div
                                className={`min-h-0 flex-1 overflow-y-auto px-6 pb-6 ${contentClassName ?? ''}`}
                            >
                                {typeof children === 'function'
                                    ? children({ close })
                                    : children}
                            </div>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    )
}
