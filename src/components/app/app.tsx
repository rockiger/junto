import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppGoogleAuthProvider } from 'lib/googleAuth'
import { SnackbarProvider } from 'notistack'
import { useGlobal } from 'reactn'

import { router } from 'router'


export default function App() {
    const [_isSignedIn] = useGlobal('isSignedIn')

    return (
        <div
            className="bg-surface-container"
        >
            <AppGoogleAuthProvider>
                <SnackbarProvider maxSnack={3}>
                    <RouterProvider router={router} />
                    {import.meta.env?.DEV ? (
                        <TanStackRouterDevtools router={router} />
                    ) : null}
                </SnackbarProvider>
            </AppGoogleAuthProvider>
        </div>
    )
}
