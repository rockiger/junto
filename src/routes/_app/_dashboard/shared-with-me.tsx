import { createFileRoute } from '@tanstack/react-router'

import { SharedWithMe } from 'components/SharedWithMe'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/_dashboard/shared-with-me')({
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
