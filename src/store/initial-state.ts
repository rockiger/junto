import type { AppState } from 'types/app-state'

export const initialAppState: AppState = {
    backgroundUpdate: false,
    goToNewFile: false,
    hints: {},
    hintsFileId: '',
    hintCounter: 0,
    isCreatingNewFile: false,
    migration: null,
    redirect: false,
    showSidebarOnMobile: false,
}
