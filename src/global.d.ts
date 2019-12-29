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
        files: any[]
        initialFiles: any[]
        isInitialFileListLoading: boolean
        backgroundUpdate: boolean
    }
}
