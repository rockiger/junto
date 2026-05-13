import { createFileRoute } from '@tanstack/react-router'
import Page from 'components/Page'
import { useGlobal } from 'reactn'

export const Route = createFileRoute('/page/$id')({
    component: PageRoute,
})

function PageRoute() {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    console.log({ isSigningIn, isCreatingNewFile, isSignedIn })
    console.log((!isSignedIn && isSigningIn), isCreatingNewFile)

    return (
        <Page
            isCreatingNewFile={isCreatingNewFile}
            isSignedIn={isSignedIn}
            isSigningIn={isSigningIn}
            setGoToNewFile={setGoToNewFile}
        />
    )
}
