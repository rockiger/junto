import { createFileRoute } from '@tanstack/react-router'
import { useGlobal } from 'reactn'
import { SharedWithMe } from 'components/SharedWithMe'

export const Route = createFileRoute('/shared-with-me')({
    component: SharedWithMeRoute,
})

function SharedWithMeRoute() {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    return (
        <SharedWithMe
            isCreatingNewFile={isCreatingNewFile}
            isSignedIn={isSignedIn}
            isSigningIn={isSigningIn}
            setGoToNewFile={setGoToNewFile}
        />
    )
}
