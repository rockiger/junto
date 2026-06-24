import type { AppState } from 'types/app-state'

export const initialAppState: AppState = {
    backgroundUpdate: false,
    files: [],
    goToNewFile: false,
    hints: {},
    hintsFileId: '',
    hintCounter: 0,
    initialFiles: [],
    isCreatingNewFile: false,
    isFileListLoading: false,
    isInitialFileListLoading: false,
    isSearchFieldActive: false,
    isSignedIn: false,
    isSigningIn: true,
    migration: null,
    redirect: false,
    rootFolderId: null,
    searchTerm: '',
    searchValue: '',
    showSidebarOnMobile: false,
    userId: '',
}
