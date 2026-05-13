import React, { useMemo } from 'react'
import {
    Outlet,
    RouterProvider,
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router'
import { storiesOf } from '@storybook/react'

import { SidebarTreeItem } from './SidebarTreeItem'
import { useStyles } from './SidebarTree-styles'
import testState from './testState.js'

import { MYHOME } from '../../../lib/constants'

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
                border: '1px solid rgba(0,0,0, 0.2',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', SidebarDefault)

function StoryShell() {
    const { files } = (window.testState = testState)
    const classes = useStyles()

    console.log(testState)
    return (
        <>
            <ul className={classes.mydrive}>
                <SidebarTreeItem
                    expand={true}
                    files={files}
                    label={MYHOME}
                    level={0}
                    pageId={'1vYllhFQojUFl9PpVRnW1uqJcPGigXF2D'}
                    parentId={'10t_Nrv_DUoOSbp9MoYGmfm1Cdj--Zc0D'}
                />
            </ul>
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
        []
    )
    return <RouterProvider router={router} />
}
