import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AppState } from 'types/app-state'
import { initialAppState } from './initial-state'

const PERSIST_KEY = '@reactn'

type AppActions = {
    clearSearchComplete: () => void
    clearSearchFiles: () => void
    clearSearchMeta: () => void
}

export type AppStore = AppState & AppActions

function migrateLegacyPersistValue(raw: string | null): string | null {
    if (!raw) return raw
    try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && 'state' in parsed) {
            return raw
        }
        return JSON.stringify({ state: parsed, version: 0 })
    } catch {
        return raw
    }
}

const legacyAwareStorage = createJSONStorage(() => ({
    getItem: (name: string) => {
        const value = localStorage.getItem(name)
        return migrateLegacyPersistValue(value)
    },
    setItem: (name: string, value: string) => {
        localStorage.setItem(name, value)
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name)
    },
}))

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            ...initialAppState,
            clearSearchComplete: () =>
                set({
                    files: [],
                    isSearchFieldActive: false,
                    searchTerm: '',
                    searchValue: '',
                }),
            clearSearchFiles: () => set({ files: [] }),
            clearSearchMeta: () =>
                set({
                    isSearchFieldActive: false,
                    searchTerm: '',
                    searchValue: '',
                }),
        }),
        {
            name: PERSIST_KEY,
            storage: legacyAwareStorage,
            partialize: (state) => ({
                hints: state.hints,
                initialFiles: state.initialFiles,
                rootFolderId: state.rootFolderId,
            }),
        },
    ),
)

export function getAppState(): AppState {
    const { clearSearchComplete, clearSearchFiles, clearSearchMeta, ...state } =
        useAppStore.getState()
    void clearSearchComplete
    void clearSearchFiles
    void clearSearchMeta
    return state
}

export function setAppState(partial: Partial<AppState>): void {
    useAppStore.setState(partial)
}

export function resetAppStore(overrides: Partial<AppState> = {}): void {
    useAppStore.setState({ ...initialAppState, ...overrides })
}
