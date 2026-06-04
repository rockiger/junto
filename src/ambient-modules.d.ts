declare module 'react-use-dimensions' {
    export default function useDimensions(): [
        (node: Element | null) => void,
        { width: number; height: number; [key: string]: number },
        Element | null,
    ]
}

declare module 'react-modal' {
    import type { ComponentType, ReactNode } from 'react'
    interface ReactModalProps {
        children?: ReactNode
        isOpen?: boolean
        onRequestClose?: (event?: unknown) => void
        className?: string
        overlayClassName?: string
        contentLabel?: string
        [key: string]: unknown
    }
    const ReactModal: ComponentType<ReactModalProps> & {
        setAppElement: (element: HTMLElement | string) => void
    }
    export default ReactModal
}
