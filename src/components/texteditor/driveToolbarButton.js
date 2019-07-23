/* global gapi */
/* global google */
import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import GoogleDriveIcon from 'mdi-react/GoogleDriveIcon'

import { API_KEY } from '../../lib/constants'

const useStyles = makeStyles(theme => ({
    icon: {
      height: 40,
      width: 40,
    }
  }))

const openPicker = () => {
    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    var view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("image/png,image/jpeg,image/jpg");
    var picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setDeveloperKey(API_KEY)
        .setCallback((data) => console.log('DATA:', data))
        .build();
    picker.setVisible(true);
}

const DriveToolbarButton = props => {
    const classes = useStyles()
    return (
        <IconButton
            className={classes.icon}
            onClick={openPicker}
            size="small"
        >
            <GoogleDriveIcon />
        </IconButton>
    )
}

export default DriveToolbarButton