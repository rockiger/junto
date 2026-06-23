// @ts-nocheck
import { useMemo } from 'react'
import { addReducers } from 'reactn'
import {
    Outlet,
    RouterProvider,
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router'
import { storiesOf } from '@storybook/react'

import { SidebarTreeComponent } from './SidebarTree-component'
import testState from './testState'

addReducers({
    clearSearchComplete: (_global, _dispatch) => ({
        files: [],
        isSearchFieldActive: false,
        searchTerm: '',
        searchValue: '',
    }),
})

const rootRoute = createRootRoute({
    component: StoryShell,
})

const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/page/$id',
    component: () => null,
})

const storyRouteTree = rootRoute.addChildren([pageRoute])

storiesOf('SidebarTree', module)
    .addDecorator(story => (
        <div
            style={{
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2)',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', SidebarDefault)
    .add('nested page active', SidebarNestedPage)

function StoryShell() {
    const { files, rootFolderId } = testState

    return (
        <>
            <SidebarTreeComponent
                initialFiles={files}
                rootFolderId={rootFolderId}
            />
            <Outlet />
        </>
    )
}

function SidebarDefault() {
    const router = useMemo(
        () =>
            createRouter({
                routeTree: storyRouteTree,
                history: createMemoryHistory({ initialEntries: ['/'] }),
                trailingSlash: 'preserve',
            }),
        [],
    )
    return <RouterProvider router={router} />
}

function SidebarNestedPage() {
    const router = useMemo(
        () =>
            createRouter({
                routeTree: storyRouteTree,
                history: createMemoryHistory({
                    initialEntries: [
                        '/page/1LkWywADe6RiFW_JoJ14bw3NjzjBxZiTw',
                    ],
                }),
                trailingSlash: 'preserve',
            }),
        [],
    )
    return <RouterProvider router={router} />
}
