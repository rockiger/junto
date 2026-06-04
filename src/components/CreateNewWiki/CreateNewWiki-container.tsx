//@ts-check
import { useEffect, useGlobal, useRef } from 'reactn'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { createFile, createNewWiki } from 'db'
import Spinner from 'components/gsuite-components/spinner'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'

import { CreateNewWikiModal } from './CreateNewWikiModal'

interface CreateNewWikiProps {
    isSignedIn: boolean
    isSigningIn: boolean
}

type WikiModalHandle = {
    show: () => Promise<{ description?: string; name: string }>
}

export const CreateNewWiki = ({ isSignedIn, isSigningIn }: CreateNewWikiProps) => {
    const [, setBackgroundUpdate] = useGlobal('backgroundUpdate')
    const [isCreatingNewFile, setIsCreatingNewFile] = useGlobal(
        'isCreatingNewFile',
    )

    const navigate = useNavigate()
    const modalRef = useRef<WikiModalHandle | null>(null)

    const { searchStr } = useLocation()
    const state = getState(searchStr)
    const folderId = state?.folderId ?? ''

    useEffect(() => {
        async function createWikiFlow() {
            try {
                if (isSignedIn) {
                    console.log({ folderId })
                    const modal = modalRef.current
                    if (!modal) return
                    try {
                        const result = await modal.show()
                        console.log({ result })
                        const { description = '', name } = result
                        setIsCreatingNewFile(true)
                        const newRootFolderId = await createNewWiki({
                            name,
                            parentId: folderId,
                            supportsAllDrives: true,
                            description,
                        })
                        if (!newRootFolderId) return
                        const newFileId = await createFile(
                            OVERVIEW_NAME,
                            newRootFolderId,
                            OVERVIEW_VALUE,
                            name,
                        )
                        if (!newFileId) return
                        navigate({
                            to: '/page/$id',
                            params: { id: newFileId },
                        })
                    } catch (err) {
                        console.log({ err })
                        setIsCreatingNewFile(false)
                        if (!err) navigate({ to: '/home' })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
        void createWikiFlow()
    }, [
        folderId,
        navigate,
        isSignedIn,
        setBackgroundUpdate,
        setIsCreatingNewFile,
        state,
    ])

    if ((!isSignedIn && isSigningIn) || isCreatingNewFile) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    }
    return (
        <>
            <h1 style={{ padding: '.5rem' }}>Creating your Wiki ...</h1>
            {/* @ts-expect-error modal ref typing */}
            <CreateNewWikiModal ref={modalRef} />
        </>
    )
}

export const getState = (
    search: string,
): { folderId: string; action: string; userId: string } | null => {
    const urlParams = new URLSearchParams(search)
    const stateString = urlParams.get('state')

    if (stateString && typeof stateString === 'string') {
        return JSON.parse(stateString) as {
            folderId: string
            action: string
            userId: string
        }
    }
    return null
}
