import 'reactn'

declare module 'reactn/default' {
    export interface State {
        isCreatingNewFile: boolean
        rootFolderId: null | string
        isFileListLoading: boolean
        isSearchFieldActive: boolean
        isSignedIn: boolean
        isSigningIn: boolean
        goToNewFile: boolean
        oldSearchTerm: '' | string
        redirect: boolean
        searchTerm: '' | string
        searchValue: '' | string // The value in the searchfield
        files: IFile[]
        initialFiles: IFile[]
        isInitialFileListLoading: boolean
        backgroundUpdate: boolean
    }

    export interface IFile {
        id: string
        name: string
        parents: Array<string> // the id of the parrent of a file
        mimeType: 'application/vnd.google-apps.folder' | 'application/json'
        shared?: boolean
        ownedByMe?: boolean
        properties: { [key: string]: any }
        [key: string]: any
    }
}
