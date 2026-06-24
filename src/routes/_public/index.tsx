import {
    createFileRoute,
    Navigate,
    redirect,
} from '@tanstack/react-router'

import FrontPage from 'components/Home/front-page'
import { getAppState, useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_public/')({
    beforeLoad: () => {
        if (getAppState().isSignedIn) {
            throw redirect({ to: '/home' })
        }
    },
    component: PublicIndex,
})

/** Redirect after client-side sign-in; `beforeLoad` only runs on navigation. */
function PublicIndex() {
    const isSignedIn = useAppStore((s) => s.isSignedIn)

    if (isSignedIn) {
        return <Navigate to="/home" replace />
    }

    return <FrontPage />
}
