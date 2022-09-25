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
        areWikisLoading: boolean
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
        wikis: Wiki[]
        userId: string
    }

    export interface IFile {
        author: {
            avatar: string // URL
            name: string
        }
        body: string // HTML
        excerpt: string
        created: string // DATE
        id: string
        isOverview: boolean
        isStarred: boolean
        modified: string // DATE
        status: 'draft' | 'pending' | 'publish'
        title: string
    }

    export interface Wiki {
        count: number
        description: string
        id: string
        name: string
        overviewPage: string // ID
    }

    export type IFileOrNull = IFile | null

    export type SimpleMap = { [key: string]: any }
}
