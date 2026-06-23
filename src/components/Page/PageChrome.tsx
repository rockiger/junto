import { useNavigate, useRouter } from '@tanstack/react-router'
import IconButton from 'components/gsuite-components/icon-button'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'

type PageChromeProps = {
    /** Optional visible title; editor keeps the real document title in-page. */
    title?: string
}

export function PageChrome({ title }: PageChromeProps) {
    const navigate = useNavigate()
    const router = useRouter()

    const onBack = () => {
        if (router.history.canGoBack()) {
            router.history.back()
        } else {
            void navigate({ to: '/home' })
        }
    }

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-edge-strong bg-surface-paper px-2 md:px-3">
            <IconButton ariaLabel="Back" onClick={onBack}>
                <ArrowLeftIcon aria-hidden />
            </IconButton>
            {title ? (
                <span className="truncate text-base font-medium text-fg-default">
                    {title}
                </span>
            ) : null}
        </header>
    )
}
