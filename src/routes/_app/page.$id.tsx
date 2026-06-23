import { createFileRoute } from '@tanstack/react-router'

import FocusLayout from 'components/layouts/FocusLayout'
import Page from 'components/Page'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/_app/page/$id')({
    component: PageRoute,
})

function PageRoute() {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    return (
        <FocusLayout>
            <Page
                isCreatingNewFile={isCreatingNewFile}
                isSignedIn={isSignedIn}
                isSigningIn={isSigningIn}
                setGoToNewFile={setGoToNewFile}
            />
        </FocusLayout>
    )
}
