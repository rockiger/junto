import { useMemo } from 'react'
import {
    RouterProvider,
    createMemoryHistory,
    createRouter,
} from '@tanstack/react-router'
import type { AuthContext } from 'lib/googleAuth/googleAuthProvider'
import { routeTree } from './routeTree.gen'

const testAuthContext: AuthContext = {
    isSignedIn: true,
    isSigningIn: false,
    userId: 'test-user',
    signIn: () => {},
    signOut: () => {},
    isReady: true,
}

export function createTestRouter(initialPath: string) {
    const history = createMemoryHistory({
        initialEntries: [initialPath],
    })
    return createRouter({
        routeTree,
        history,
        trailingSlash: 'preserve',
        context: { auth: testAuthContext },
    })
}

export function TestRouter({ initialPath = '/' }: { initialPath?: string }) {
    const router = useMemo(
        () => createTestRouter(initialPath),
        [initialPath],
    )
    return (
        <RouterProvider router={router} context={{ auth: testAuthContext }} />
    )
}
