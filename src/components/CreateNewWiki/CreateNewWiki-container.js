//@ts-check
import React, { useEffect, useGlobal, useRef } from 'reactn'
import { useHistory, useLocation } from 'react-router'

import Spinner from 'components/gsuite-components/spinner'
import { createFile, createNewWiki, updateFile } from 'lib/gdrive'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'

import { CreateNewWikiModal } from './CreateNewWikiModal'

export const CreateNewWiki = ({ isSignedIn, isSigningIn }) => {
    const [, setBackgroundUpdate] = useGlobal('backgroundUpdate')
    const [isCreatingNewFile, setIsCreatingNewFile] = useGlobal(
        //@ts-ignore
        'isCreatingNewFile'
    )

    const history = useHistory()
    const location = useLocation()
    const modalRef = useRef(null)

    const { search } = location
    const state = getState(search)
    //@ts-ignore
    const { folderId } = state

    useEffect(() => {
        // Create an scoped async function in the hook
        async function anyNameFunction(state) {
            try {
                if (isSignedIn) {
                    console.log({ folderId })
                    const modal = modalRef.current
                    try {
                        // Wait for user input
                        const result = await modal.show()
                        console.log({ result })
                        const { description = '', name } = result
                        // Create wiki folder with extra meta data and overview file
                        // Show spinner
                        setIsCreatingNewFile(true)
                        const newRootFolderId = await createNewWiki({
                            name,
                            parentId: folderId,
                            supportsAllDrives: true,
                            description,
                        })
                        const newFileId = await createFile(
                            OVERVIEW_NAME,
                            newRootFolderId,
                            true,
                            name
                        )
                        await updateFile(newFileId, OVERVIEW_VALUE, true)
                        setBackgroundUpdate(true)
                        setIsCreatingNewFile(false)
                        history.push(`/page/${newFileId}`)
                    } catch (err) {
                        console.log({ err })
                        setIsCreatingNewFile(false)
                        if (!err) history.push('/')
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
        anyNameFunction(state)
    }, [
        folderId,
        history,
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
    } else {
        return (
            <>
                <h1 style={{ padding: '.5rem' }}>Creating your Wiki ...</h1>
                <CreateNewWikiModal ref={modalRef} />
            </>
        )
    }
}

/**
 *
 * @param {string} search
 * @returns { {folderId: string, action: string, userId: string } | null}
 */
export const getState = (search) => {
    const urlParams = new URLSearchParams(search)

    const stateString = urlParams.get('state')

    if (stateString && typeof stateString === 'string') {
        const state = JSON.parse(stateString)
        return state
    }
    return null
}

/**
 *
 * Metadata für the returned folderId can't be retrieved
 * But a folder can be created 
 * 
 * 
var fileMetadata = {
        name: 'Test',
        mimeType: 'application/vnd.google-apps.folder',
}
fileMetadata.parent = ['0AG0tMzmAeEIiUk9PVA']
 
const result = await gapi.client.drive.files.create({
            resource: fileMetadata,
})
 */
