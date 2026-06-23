import {
    createFileRoute,
    Navigate,
    redirect,
} from '@tanstack/react-router'

import FrontPage from 'components/Home/front-page'
import { getGlobal, useGlobal } from 'reactn'

export const Route = createFileRoute('/_public/')({
    beforeLoad: () => {
        if (getGlobal().isSignedIn) {
            throw redirect({ to: '/home' })
        }
    },
    component: PublicIndex,
})

/** Redirect after client-side sign-in; `beforeLoad` only runs on navigation. */
function PublicIndex() {
    const [isSignedIn] = useGlobal('isSignedIn')

    if (isSignedIn) {
        return <Navigate to="/home" replace />
    }

    return <FrontPage />
}
