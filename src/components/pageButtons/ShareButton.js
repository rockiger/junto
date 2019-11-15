/* global gapi */

import React, { useEffect } from 'react'
import AccountPlusIcon from 'mdi-react/AccountPlusOutlineIcon'

import { Button } from 'components/pageButtons'

export function ShareButton({ fileId }) {
    useEffect(() => {
        gapi.load('drive-share', () => initPicker(fileId))
    }, [fileId])
    return (
        <Button
            aria-controls="button-menu"
            aria-haspopup="true"
            onClick={() => {
                window.share.showSettingsDialog()
            }}
        >
            <AccountPlusIcon />
        </Button>
    )
}

function initPicker(fileId) {
    const oauthToken = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token
    window.share = new gapi.drive.share.ShareClient()
    window.share.setOAuthToken(oauthToken)
    window.share.setItemIds([fileId])
}
