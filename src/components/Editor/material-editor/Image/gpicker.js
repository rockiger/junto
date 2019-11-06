/* global gapi */
/* global google */

export function getImage(apiKey) {
    return new Promise((resolve, reject) => {
        const pickerCallback = async (data, onChange, value) => {
            console.log('data:', data)
            console.log('onChange:', onChange)
            console.log('value:', value)
            console.log(data.action)
            switch (data.action) {
                case 'loaded':
                    console.log('Picker loaded')
                    break

                case 'picked':
                    console.log('Picker picked')
                    console.log(data.docs[0])
                    const fileId = data.docs[0].id
                    resolve(
                        `https://drive.google.com/uc?id=${fileId}&export=download`
                    )
                    break

                case 'cancel':
                    reject(Error('cancel'))
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

            const myImages = new google.picker.DocsView(
                google.picker.ViewId.DOCS_IMAGES
            )
                .setIncludeFolders(true)
                .setOwnedByMe(true)
                .setLabel('My Images')
            const sharedWithMe = new google.picker.DocsView(
                google.picker.ViewId.DOCS_IMAGES
            )
                .setIncludeFolders(true)
                .setOwnedByMe(false)
            var uploadView = new google.picker.DocsUploadView()
            uploadView.setMimeTypes(
                'image/png,image/jpeg,image/jpg, image/svg+xml, image/gif, image/webp, image/bmp, image/tiff'
            )
            var picker = new google.picker.PickerBuilder()
                .addView(myImages)
                .addView(sharedWithMe)
                .addView(uploadView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setTitle('Select an image from Google Drive')
                .setCallback(data => pickerCallback(data, onChange, value))
                .build()
            picker.setVisible(true)
        }

        openPicker()
    })
}
