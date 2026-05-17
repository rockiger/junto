import React, { useMemo, useState } from 'react'
import {
    Outlet,
    RouterProvider,
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router'
import { storiesOf } from '@storybook/react'

import { SearchAutocomplete } from './SearchAutocomplete'
import testState from './testState.js'

const rootRoute = createRootRoute({
    component: SearchStoryShell,
})

const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/page/$id',
    component: () => null,
})

const storyRouteTree = rootRoute.addChildren([pageRoute])

storiesOf('SearchAutocomplete', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => <SearchAutocompleteStory />)

function SearchStoryShell() {
    const { files } = testState
    const [filteredFiles, setFilteredFiles] = useState(files)

    return (
        <>
            <SearchAutocomplete
                clearSearch={() => {}}
                files={files}
                filteredFiles={filteredFiles}
                searchValue={''}
                setFilteredFiles={setFilteredFiles}
                setSubmitSelected={() => {}}
            />
            <Outlet />
        </>
    )
}

function SearchAutocompleteStory() {
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
