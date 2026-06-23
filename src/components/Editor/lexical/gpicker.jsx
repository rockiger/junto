/* global google */

import { getAccessToken } from 'lib/googleAuth'

/**
 * Opens the Google Picker for images and resolves with a direct download URL.
 * (Port of material-editor/Image/gpicker.jsx)
 */
export function getImage(apiKey) {
    return new Promise((resolve, reject) => {
        const pickerCallback = data => {
            switch (data.action) {
                case 'picked': {
                    const fileId = data.docs[0].id
                    resolve(
                        `https://drive.google.com/uc?id=${fileId}&export=download`
                    )
                    break
                }
                case 'cancel':
                    reject(Error('cancel'))
                    break
                default:
                    break
            }
        }

        const accessToken = getAccessToken()
        if (!accessToken) {
            reject(new Error('No Google access token available'))
            return
        }

        const myImages = new google.picker.DocsView(
            google.picker.ViewId.DOCS_IMAGES
        )
            .setIncludeFolders(true)
            .setOwnedByMe(true)
            .setLabel('My Images')

        const sharedDrivesView = new google.picker.DocsView(
            google.picker.ViewId.DOCS_IMAGES
        )
            .setIncludeFolders(true)
            .setEnableDrives(true)

        const sharedWithMe = new google.picker.DocsView(
            google.picker.ViewId.DOCS_IMAGES
        )
            .setIncludeFolders(true)
            .setOwnedByMe(false)

        const uploadView = new google.picker.DocsUploadView()
        uploadView.setMimeTypes(
            'image/png,image/jpeg,image/jpg, image/svg+xml, image/gif, image/webp, image/bmp, image/tiff'
        )

        new google.picker.PickerBuilder()
            .addView(myImages)
            .addView(sharedDrivesView)
            .addView(sharedWithMe)
            .addView(uploadView)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey)
            .setTitle('Select an image from Google Drive')
            .setCallback(pickerCallback)
            .build()
            .setVisible(true)
    })
}

/**
 * Opens the Google Picker for any Drive document and resolves with its metadata.
 * (Port of material-editor/Drive/gpicker.jsx)
 */
export function getDocument(apiKey) {
    return new Promise((resolve, reject) => {
        const pickerCallback = data => {
            switch (data.action) {
                case 'picked':
                    resolve({
                        id: data.docs[0].id,
                        name: data.docs[0].name,
                        href: data.docs[0].url,
                        iconUrl: data.docs[0].iconUrl,
                    })
                    break
                case 'cancel':
                    reject(Error('cancel'))
                    break
                default:
                    break
            }
        }

        const accessToken = getAccessToken()
        if (!accessToken) {
            reject(new Error('No Google access token available'))
            return
        }

        const myDocuments = new google.picker.DocsView(google.picker.ViewId.DOCS)
            .setIncludeFolders(true)
            .setOwnedByMe(true)
        const sharedWithMe = new google.picker.DocsView(google.picker.ViewId.DOCS)
            .setIncludeFolders(true)
            .setOwnedByMe(false)
        const uploadView = new google.picker.DocsUploadView()
        const sharedDrivesView = new google.picker.DocsView()
            .setIncludeFolders(true)
            .setEnableDrives(true)

        new google.picker.PickerBuilder()
            .addView(myDocuments)
            .addView(sharedDrivesView)
            .addView(sharedWithMe)
            .addView(uploadView)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey)
            .setTitle('Select a file from Google Drive')
            .setCallback(pickerCallback)
            .build()
            .setVisible(true)
    })
}
