import { useMemo } from 'react'
import {
    RouterProvider,
    createMemoryHistory,
    createRouter,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createTestRouter(initialPath: string) {
    const history = createMemoryHistory({
        initialEntries: [initialPath],
    })
    return createRouter({
        routeTree,
        history,
        trailingSlash: 'preserve',
    })
}

export function TestRouter({ initialPath = '/' }: { initialPath?: string }) {
    const router = useMemo(
        () => createTestRouter(initialPath),
        [initialPath]
    )
    return <RouterProvider router={router} />
}
