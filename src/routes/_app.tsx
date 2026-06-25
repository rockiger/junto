import GoogleLogin from 'components/googleLogin.tsx'
import {
    createFileRoute,
    Outlet,
    redirect,
    useMatch,
    useNavigate,
} from '@tanstack/react-router'
import { useGoogleAuth } from 'lib/googleAuth'
import { useEffect } from 'react'

export const Route = createFileRoute('/_app')({
    beforeLoad: ({ context }) => {
        const { isSignedIn, isSigningIn } = context.auth
        if (!isSignedIn && !isSigningIn) {
            throw redirect({ to: '/' })
        }
    },
    component: AppShell,
})

function AppShell() {
    const navigate = useNavigate()
    const { isSignedIn, isSigningIn } = useGoogleAuth()
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
