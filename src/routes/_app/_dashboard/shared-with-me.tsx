import { createFileRoute } from '@tanstack/react-router'

import { SharedWithMe } from 'components/SharedWithMe'
import { useAppStore } from 'store/app-store'

export const Route = createFileRoute('/_app/_dashboard/shared-with-me')({
    component: SharedWithMeRoute,
})

function SharedWithMeRoute() {
    const isCreatingNewFile = useAppStore((s) => s.isCreatingNewFile)
    const setGoToNewFile = (goToNewFile: boolean) =>
        useAppStore.setState({ goToNewFile })

    return (
        <SharedWithMe
            isCreatingNewFile={isCreatingNewFile}
            setGoToNewFile={setGoToNewFile}
        />
    )
}
