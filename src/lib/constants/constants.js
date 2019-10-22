import { createMuiTheme } from '@material-ui/core/styles'

// Client ID and API key from the Developer Console
export const CLIENT_ID =
    '464179900942-rlasrj6fsa9o0oftnfoubir6492gunc0.apps.googleusercontent.com'
export const API_KEY = 'AIzaSyCKep9GmOSzI430T8xk5OfFUg4RHrtyryw'

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
export const MYHOME = 'My Fulcrum'
export const OVERVIEW_NAME = '_myDrive_overview_please_do_not_touch' + EXT
export const UNTITLEDNAME = 'Untitled page'
export const UNTITLEDFILE = UNTITLEDNAME + EXT

export const DEFAULTVALUE = {}

export const THEMEVARS = {
    background: '#fff',
    backgroundDark: '#f1f3f4',
    primary: '#4285f4',
    grey: '#6e6f70',
    secondary: '#ea4335',
    text: '#3c4043',
}

export const THEME = createMuiTheme({
    palette: {
        background: {
            default: THEMEVARS.background,
            alternative: THEMEVARS.backgroundDark,
        },
        primary: {
            main: THEMEVARS.primary,
        },
        secondary: {
            main: THEMEVARS.secondary,
        },
        grey: {
            foreground: THEMEVARS.grey,
        },
        text: {
            primary: THEMEVARS.text,
        },
    },
    typography: {
        h2: {
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 400,
        },
    },
})

window.THEME = THEME

export const EMPTYVALUE = {
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        text: '',
                    },
                ],
            },
        ],
    },
}