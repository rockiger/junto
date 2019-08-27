/* global gapi */
/* global google */
import React from 'react'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GoogleDriveIcon from 'mdi-react/GoogleDriveIcon'

import { insertLinkStrategy } from './DriveUtils'

import { API_KEY } from '../../../../lib/constants'

const useStyles = makeStyles(theme => ({
    icon: {
        height: 40,
        width: 40,
    },
}))

const pickerCallback = (data, onChange, value) => {
    console.log('data:', data)
    console.log('onChange:', onChange)
    console.log('value:', value)
    switch (data.action) {
        case 'loaded':
            console.log('Picker loaded')
            break

        case 'picked':
            console.log('Picker picked')
            console.log(data.docs[0])
            onChange(insertLinkStrategy(value.change(), data.docs[0]))
            break

        default:
            break
    }
}

const openPicker = (onChange, value) => {
    const accessToken = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token
    var view = new google.picker.View(google.picker.ViewId.DOCS)
    view.setMimeTypes('image/png,image/jpeg,image/jpg')
    var picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY)
        .setCallback(data => pickerCallback(data, onChange, value))
        .build()
    picker.setVisible(true)
}

const DriveToolbarButton = ({ value, onChange, outerState: { readOnly } }) => {
    const classes = useStyles() // HOOK: Don't call hooks conditionally
    //if (readOnly) return null
    return (
        <IconButton
            className={classes.icon}
            onClick={ev => openPicker(onChange, value)}
            size="small"
        >
            <GoogleDriveIcon />
        </IconButton>
    )
}

export default DriveToolbarButton
