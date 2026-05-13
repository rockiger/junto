import { createFileRoute } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import Home from 'components/Home'

export const Route = createFileRoute('/')({
    component: HomeRoute,
})

function HomeRoute() {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    return (
        <Home
            isCreatingNewFile={isCreatingNewFile}
            isSignedIn={isSignedIn}
            isSigningIn={isSigningIn}
            setGoToNewFile={setGoToNewFile}
        />
    )
}
