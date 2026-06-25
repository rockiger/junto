import {
    createFileRoute,
    Navigate,
    redirect,
} from '@tanstack/react-router'

import FrontPage from 'components/Home/front-page'
import { useGoogleAuth } from 'lib/googleAuth'

export const Route = createFileRoute('/_public/')({
    beforeLoad: ({ context }) => {
        if (context.auth.isSignedIn) {
            throw redirect({ to: '/home' })
        }
    },
    component: PublicIndex,
})

/** Redirect after client-side sign-in; `beforeLoad` only runs on navigation. */
function PublicIndex() {
    const { isSignedIn } = useGoogleAuth()

    if (isSignedIn) {
        return <Navigate to="/home" replace />
    }

    return <FrontPage />
}
