/* global gapi */
/* global google */

export function getDocument(apiKey) {
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

        const openPicker = (onChange, value) => {
            const accessToken = gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .getAuthResponse().access_token

            const myDocuments = new google.picker.DocsView(
                google.picker.ViewId.DOCS
            )
                .setIncludeFolders(true)
                .setOwnedByMe(true)
            const sharedWithMe = new google.picker.DocsView(
                google.picker.ViewId.DOCS
            )
                .setIncludeFolders(true)
                .setOwnedByMe(false)
            var uploadView = new google.picker.DocsUploadView()
            var picker = new google.picker.PickerBuilder()
                .addView(myDocuments)
                .addView(sharedWithMe)
                .addView(uploadView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setTitle('Select a file from Google Drive')
                .setCallback(data => pickerCallback(data, onChange, value))
                .build()
            picker.setVisible(true)
        }

        openPicker()
    })
}
