/* global gapi */

import { useEffect } from 'react'
import AccountPlusIcon from 'mdi-react/AccountPlusOutlineIcon'
import { getAccessToken } from 'lib/googleAuth'

export function useShareMenuItem({ fileId }) {
    useEffect(() => {
        gapi.load('drive-share', () => initPicker(fileId))
    }, [fileId])
    return {
        title: 'Share',
        handler: () => {
            window.share.showSettingsDialog()
        },
        icon: AccountPlusIcon,
    }
}

export function ShareMenuItem(props) {
    return useShareMenuItem(props)
}

function initPicker(fileId) {
    try {
        const oauthToken = getAccessToken()
        if (!oauthToken) {
            throw new Error('No Google access token available')
        }
        window.share = new gapi.drive.share.ShareClient()
        window.share.setOAuthToken(oauthToken)
        window.share.setItemIds([fileId])
    } catch (e) {
        console.error(e)
    }
}
