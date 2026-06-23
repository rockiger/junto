import { useGlobal } from 'reactn'
import clsx from 'clsx'

import SidebarContent from 'components/Sidebar'

export default function Sidebar() {
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useGlobal(
        'showSidebarOnMobile'
    )
    return (
        <>
            <div
                className={clsx(
                    'fixed right-0 z-1000 h-screen w-screen bg-black transition-opacity duration-300 ease-linear lg:hidden',
                    showSidebarOnMobile
                        ? 'block opacity-50'
                        : 'hidden opacity-0'
                )}
                onClick={() => setShowSidebarOnMobile(false)}
            />
            <div
                className={clsx(
                    '[grid-area:sidebar] p-4 lg:py-0',
                    'fixed z-1000 h-screen w-[calc(100vw-56px)] overflow-auto bg-surface-paper transition-[left] duration-300 ease-out',
                    'lg:static lg:h-[calc(100vh-148px)] lg:w-auto lg:overflow-x-clip lg:overflow-y-auto lg:scrollbar-gutter-stable lg:bg-transparent',
                    showSidebarOnMobile
                        ? 'left-0'
                        : 'left-[calc(-100vw-56px)]'
                )}
            >
                <SidebarContent />
            </div>
        </>
    )
}
