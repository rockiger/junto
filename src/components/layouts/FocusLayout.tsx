import type { ReactNode } from 'react'


type FocusLayoutProps = {
    children: ReactNode
}

/**
 * Page editor shell: no global header/sidebar/dock; minimal top chrome + child.
 */
export default function FocusLayout({ children }: FocusLayoutProps) {
    return (
        <div className="flex min-h-dvh flex-col bg-surface-paper">
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}
