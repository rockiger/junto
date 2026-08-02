import { createRouter } from '@tanstack/react-router'
import { setupRouterPageTracking } from 'components/Tracking'
import type { AuthContext } from 'lib/googleAuth/googleAuthProvider'

import { routeTree } from './routeTree.gen'

export const router = createRouter({
    routeTree,
    trailingSlash: 'preserve',
    context: {
        auth: undefined! as AuthContext,
    },
    defaultOnCatch: (error, errorInfo) => {
        console.error('[Router] Uncaught route error:', error)
        if (error.stack) {
            console.error(error.stack)
        }
        if (errorInfo?.componentStack) {
            console.error('[Router] Component stack:', errorInfo.componentStack)
        }
    },
    defaultErrorComponent: ({ error }) => {
        console.error('[Router] Error:', error)
        return <div>Error: {error.message}</div>
    }
})

setupRouterPageTracking(router)

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
