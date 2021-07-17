import 'reactn'
import { HintMap } from 'components/gsuite-components/hint'

declare module 'reactn/default' {
    export interface Reducers {
        clearSearch: (
            global: State,
            dispatch: Dispatch
        ) => Pick<
            State,
            [
                'files',
                'isSearchFieldActive',
                'oldSearchTerm',
                'searchTerm',
                'searchValue'
            ]
        >
    }

    export interface State {
        hints: HintMap
        hintsFileId: string
        hintCounter: number
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
        showSidebarOnMobile: boolean
        files: IFile[]
        initialFiles: IFile[]
        isInitialFileListLoading: boolean
        backgroundUpdate: boolean
    }

    export interface IFile {
        description?: string
        id: string
        name: string
        parents: Array<string> // the id of the parrent of a file
        mimeType: 'application/vnd.google-apps.folder' | 'application/json'
        modifiedByMeTime?: string
        modifiedTime?: string
        shared?: boolean
        ownedByMe?: boolean
        properties?: {
            archived?: 'false' | 'true'
            pageName?: string
            wikiRoot?: 'false' | 'true'
            [key: string]: any
        }
        trashed: boolean
        viewedByMeTime?: string
        [key: string]: any
    }

    export type IFileOrNull = IFile | null
}
