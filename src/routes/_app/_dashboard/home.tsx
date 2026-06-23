import { createFileRoute } from '@tanstack/react-router'

import Home from 'components/Home'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/home')({
    component: HomeRoute,
})

function HomeRoute() {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')

    return (
        <Home
            isCreatingNewFile={isCreatingNewFile}
            isSignedIn={isSignedIn}
            isSigningIn={isSigningIn}
        />
    )
}
