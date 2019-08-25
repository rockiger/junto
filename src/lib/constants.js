import { createMuiTheme } from '@material-ui/core/styles'

// Client ID and API key from the Developer Console
export const CLIENT_ID =
    '***REMOVED***'
export const API_KEY = '***REMOVED***'

// Array of API discovery doc URLs for APIs used by the quickstart
export const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const SCOPES =
    'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appfolder'

export const EXT = '.gwiki'
export const EXTLENGTH = EXT.length
export const LOCALSTORAGE_NAME = 'junto-content-xlc'
export const UNTITLEDNAME = 'Untitled page'
export const UNTITLEDFILE = UNTITLEDNAME + EXT

export const DEFAULTVALUE = {}

export const THEME = createMuiTheme({
    palette: {
        background: {
            default: '#fff',
        },
        primary: {
            main: '#4285f4',
        },
        secondary: {
            main: '#ea4335',
        },
    },
    typography: {
        h6: {
            fontWeight: 400,
        },
    },
})

export const EMPTYVALUE = {
    document: {
        nodes: [
            {
                object: 'block',
                type: 'line',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                text: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
}
