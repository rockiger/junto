//@ts-check
import React, { useState, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router'

import {
    checkForFulcrumFolder,
    createFile,
    createNewWiki,
    updateFile,
} from 'lib/gdrive'
import { FOLDER_NAME, OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'

export const CreateNewWiki = ({ isSignedIn, isSigningIn }) => {
    const location = useLocation()
    const { search } = location
    const state = getState(search)
    //@ts-ignore
    const { folderId } = state
    const [files, setFiles] = useState([])

    useEffect(() => {
        // Create an scoped async function in the hook
        async function anyNameFunction(state) {
            try {
                if (isSignedIn) {
                    // TODO wait till logged in
                    console.log({ folderId })
                    if (folderId) {
                        const hasFulcrumFolder = await checkForFulcrumFolder(
                            folderId
                        )
                        if (!hasFulcrumFolder) {
                            console.log(`Creat new wiki on ${folderId}`)
                            const newRootFolderId = await createNewWiki(
                                FOLDER_NAME,
                                folderId,
                                true
                            )
                            const newFileId = await createFile(
                                OVERVIEW_NAME,
                                newRootFolderId,
                                true
                            )
                            await updateFile(newFileId, OVERVIEW_VALUE, true)
                            // this.setState({folderId: newFolderId})
                            console.log('newFolderId:', newRootFolderId)
                            // TODO this.initFiles() refresh the state
                        }
                    }
                    // TODO get Folder in look into  it
                    // TODO test if I can read the metadata of the root folder in personal drive
                }
            } catch (err) {
                console.log(err)
            }
        }
        anyNameFunction(state)
    }, [folderId, isSignedIn, state])

    return <div>Creating your Wiki {JSON.stringify(state)} </div> //<Redirect to={path} />
}

/**
 *
 * @param {string} search
 * @returns { {folderId: string, action: string, userId: string } | null}
 */
export const getState = search => {
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
