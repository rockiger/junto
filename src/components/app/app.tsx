import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { SearchUIProvider } from 'components/app/header/search-ui-context'
import { MigrationProgress } from 'components/MigrationProgress'
import { AppGoogleAuthProvider, useGoogleAuth } from 'lib/googleAuth'
import {
    queryClient,
    queryPersistDehydrateOptions,
    queryPersister,
} from 'lib/query/query-client'
import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'

import { router } from 'router'

function InnerApp() {
    const auth = useGoogleAuth()

    useEffect(() => {
        void router.invalidate()
    }, [auth.isSignedIn, auth.isSigningIn])

    return <RouterProvider router={router} context={{ auth }} />
}

export default function App() {
    return (
        <div className="bg-surface-container">
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                    persister: queryPersister,
                    dehydrateOptions: queryPersistDehydrateOptions,
                }}
            >
                <AppGoogleAuthProvider>
                    <SearchUIProvider>
                        <SnackbarProvider maxSnack={3}>
                        <InnerApp />
                        <MigrationProgress />
                        {import.meta.env?.DEV ? (
                            <TanStackRouterDevtools router={router} />
                        ) : null}
                        </SnackbarProvider>
                    </SearchUIProvider>
                </AppGoogleAuthProvider>
            </PersistQueryClientProvider>
        </div>
    )
}
