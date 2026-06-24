import { createFileRoute } from '@tanstack/react-router'

import Home from 'components/Home'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/home')({
    component: HomeRoute,
})

function HomeRoute() {
    const isCreatingNewFile = useAppStore((s) => s.isCreatingNewFile)
    const isSignedIn = useAppStore((s) => s.isSignedIn)
    const isSigningIn = useAppStore((s) => s.isSigningIn)

    return (
        <Home
            isCreatingNewFile={isCreatingNewFile}
            isSignedIn={isSignedIn}
            isSigningIn={isSigningIn}
        />
    )
}
