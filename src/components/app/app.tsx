import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { MigrationProgress } from 'components/MigrationProgress'
import { AppGoogleAuthProvider } from 'lib/googleAuth'
import { SnackbarProvider } from 'notistack'
import { useAppStore } from 'store/app-store'

import { router } from 'router'


export default function App() {
    useAppStore((s) => s.isSignedIn)

    return (
        <div
            className="bg-surface-container"
        >
            <AppGoogleAuthProvider>
                <SnackbarProvider maxSnack={3}>
                    <RouterProvider router={router} />
                    <MigrationProgress />
                    {import.meta.env?.DEV ? (
                        <TanStackRouterDevtools router={router} />
                    ) : null}
                </SnackbarProvider>
            </AppGoogleAuthProvider>
        </div>
    )
}
