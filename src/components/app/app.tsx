import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SnackbarProvider } from 'notistack'
import { useGlobal } from 'reactn'

import { router } from 'router'


export default function App() {
    const [_isSignedIn] = useGlobal('isSignedIn')

    return (
        <div
            className="flex flex-col bg-surface"
        >
            <SnackbarProvider maxSnack={3}>
                <RouterProvider router={router} />
                {import.meta.env?.DEV ? (
                    <TanStackRouterDevtools router={router} />
                ) : null}
            </SnackbarProvider>
        </div>
    )
}
