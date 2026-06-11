import 'reactn'
import { HintMap } from 'components/gsuite-components/hint'

declare module '*.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module 'mdi-react' {
    import type { FC, SVGProps } from 'react'
    export type MdiReactIconComponentType = FC<
        SVGProps<SVGSVGElement> & { size?: number | string }
    >
}

declare module 'mdi-react/*' {
    import type { MdiReactIconComponentType } from 'mdi-react'
    const Icon: MdiReactIconComponentType
    export default Icon
}

declare module 'lodash' {
    interface LoDashStatic {
        isNotEmpty: (col: unknown) => boolean
        thread: (initialValue: unknown, ...forms: unknown[]) => unknown
        trace: <T>(x: T) => T
    }
}

declare module 'react-tooltip-lite' {
    export interface TooltipProps {
        children?: import('react').ReactNode
    }
}

declare module 'reactn/default' {
    export interface Reducers {
        /** `dispatch` typed as DispatchFunction only to avoid TS circularity (full Dispatch embeds Reducers). */
        clearSearchComplete: (
            _global: State,
            _dispatch: import('reactn/types/dispatch-function').default<State>,
        ) => Pick<
            State,
            | 'files'
            | 'isSearchFieldActive'
            | 'searchTerm'
            | 'searchValue'
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
        redirect: boolean
        searchTerm: '' | string
        searchValue: '' | string // The value in the searchfield
        showSidebarOnMobile: boolean
        /** Drive full-text search results; empty when not on /search. */
        files: IFile[]
        /** Canonical file tree after login and incremental CRUD updates. */
        initialFiles: IFile[]
        isInitialFileListLoading: boolean
        backgroundUpdate: boolean
        userId: string
        /** Progress of the one-time .gwiki -> .md migration; null when idle. */
        migration: null | { done: number; running: boolean; total: number }
    }

    export interface IFile {
        capabilities: { [key: string]: boolean }
        description?: string
        id: string
        name: string
        parents: Array<string> // the id of the parrent of a file
        mimeType:
            | 'application/vnd.google-apps.folder'
            | 'application/json'
            | 'text/markdown'
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

    export type SimpleMap = { [key: string]: any }
}
