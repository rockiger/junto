import GoogleLogin from 'components/googleLogin.tsx'
import {
    createFileRoute,
    Outlet,
    redirect,
    useMatch,
    useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { getGlobal, useGlobal } from 'reactn'

export const Route = createFileRoute('/_app')({
    beforeLoad: () => {
        const { isSignedIn, isSigningIn } = getGlobal()
        // `isSignedIn` ist bis GAPI-Init false; währenddessen `isSigningIn` true.
        // Nur nach geklärter Session Gäste zur Landing schicken (sonst /page/$id → / → /home).
        if (!isSignedIn && !isSigningIn) {
            throw redirect({ to: '/' })
        }
    },
    component: AppShell,
})

function AppShell() {
    const navigate = useNavigate()
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    /** Page-Editor ohne Dashboard-Header: dort läuft sonst kein GoogleLogin → kein GAPI, kein Datei-Load. */
    const isPageEditor = useMatch({
        from: '/_app/page/$id',
        shouldThrow: false,
    })

    useEffect(() => {
        if (!isSignedIn && !isSigningIn) {
            void navigate({ to: '/', replace: true })
        }
    }, [isSignedIn, isSigningIn, navigate])

    return (
        <>
            {isPageEditor ? (
                <div
                    className={
                        isSignedIn && !isSigningIn
                            ? 'hidden'
                            : 'fixed bottom-3 left-3 z-1000 max-w-[min(100vw-1.5rem,280px)]'
                    }
                >
                    <GoogleLogin buttonText="Sign in" />
                </div>
            ) : null}
            <Outlet />
        </>
    )
}
