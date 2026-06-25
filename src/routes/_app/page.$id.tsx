import { createFileRoute } from '@tanstack/react-router'

import FocusLayout from 'components/layouts/FocusLayout'
import Page from 'components/Page'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/page/$id')({
    component: PageRoute,
})

function PageRoute() {
    const isCreatingNewFile = useAppStore((s) => s.isCreatingNewFile)
    const setGoToNewFile = (goToNewFile: boolean) =>
        useAppStore.setState({ goToNewFile })

    return (
        <FocusLayout>
            <Page
                isCreatingNewFile={isCreatingNewFile}
                setGoToNewFile={setGoToNewFile}
            />
        </FocusLayout>
    )
}
