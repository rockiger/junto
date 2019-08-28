/* global gapi */
/* global google */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ImageIcon from 'mdi-react/ImageIcon'

import { Button } from '../../slate-editor-components/src'

import { insertInlineImage } from './DriveImageUtils'

import { API_KEY } from '../../../../lib/constants'
import {} from '../../../../lib/gdrive'

const useStyles = makeStyles(theme => ({
    icon: {
        height: 40,
        width: 40,
    },
}))

const pickerCallback = async (data, onChange, value) => {
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
            const fileId = data.docs[0].id
            onChange(
                insertInlineImage({
                    change: value.change(),
                    src: `https://drive.google.com/uc?id=${fileId}&export=download`,
                })
            )
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
    var view = new google.picker.View(google.picker.ViewId.DOCS_IMAGES)
    view.setMimeTypes('image/png,image/jpeg,image/jpg')
    var picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS_IMAGES)
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY)
        .setCallback(data => pickerCallback(data, onChange, value))
        .build()
    picker.setVisible(true)
}

const DriveImageButton = ({ value, onChange, outerState: { readOnly } }) => {
    const classes = useStyles() // HOOK: Don't call hooks conditionally
    if (readOnly) return null
    return (
        <Button
            className={classes.icon}
            onClick={ev => openPicker(onChange, value)}
            size="small"
        >
            <ImageIcon />
        </Button>
    )
}

export default DriveImageButton
