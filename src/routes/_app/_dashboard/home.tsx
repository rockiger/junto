import { createFileRoute } from '@tanstack/react-router'

import Home from 'components/Home'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/home')({
    component: HomeRoute,
})

function HomeRoute() {
    const isCreatingNewFile = useAppStore((s) => s.isCreatingNewFile)

    return <Home isCreatingNewFile={isCreatingNewFile} />
}
