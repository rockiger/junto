import type { HintMap } from 'components/gsuite-components/hint'

export interface AppState {
    hints: HintMap
    hintsFileId: string
    hintCounter: number
    isCreatingNewFile: boolean
    goToNewFile: boolean
    redirect: boolean
    showSidebarOnMobile: boolean
    backgroundUpdate: boolean
    /** Progress of the one-time .gwiki -> .md migration; null when idle. */
    migration: null | { done: number; running: boolean; total: number }
}

export interface IFile {
    capabilities: { [key: string]: boolean }
    description?: string
    id: string
    name: string
    parents: Array<string>
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

/** @deprecated Use AppState instead */
export type State = AppState
