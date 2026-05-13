import React, { useGlobal } from 'reactn'
import clsx from 'clsx'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SnackbarProvider } from 'notistack'

import { router } from 'router'

import styles from './app.module.scss'

export default function App() {
    const [isSignedIn] = useGlobal('isSignedIn')

    return (
        <div
            className={clsx(styles.App, {
                [styles.App__isSignedIn]: isSignedIn,
            })}
        >
            <SnackbarProvider maxSnack={3}>
                <RouterProvider router={router} />
                {import.meta.env.DEV ? (
                    <TanStackRouterDevtools router={router} />
                ) : null}
            </SnackbarProvider>
        </div>
    )
}
