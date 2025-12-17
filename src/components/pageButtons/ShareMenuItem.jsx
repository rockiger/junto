/* global gapi */

import { useEffect } from 'react'
import AccountPlusIcon from 'mdi-react/AccountPlusOutlineIcon'

export function ShareMenuItem({ fileId }) {
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

function initPicker(fileId) {
    try {
        const oauthToken = gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().access_token
        window.share = new gapi.drive.share.ShareClient()
        window.share.setOAuthToken(oauthToken)
        window.share.setItemIds([fileId])
    } catch (e) {
        console.error(e)
    }
}
