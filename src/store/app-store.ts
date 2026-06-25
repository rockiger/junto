import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AppState } from 'types/app-state'
import { initialAppState } from './initial-state'

const PERSIST_KEY = '@reactn'

export type AppStore = AppState

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
        () => ({
            ...initialAppState,
        }),
        {
            name: PERSIST_KEY,
            storage: legacyAwareStorage,
            partialize: (state) => ({
                hints: state.hints,
            }),
        },
    ),
)

export function getAppState(): AppState {
    return useAppStore.getState()
}

export function setAppState(partial: Partial<AppState>): void {
    useAppStore.setState(partial)
}

export function resetAppStore(overrides: Partial<AppState> = {}): void {
    useAppStore.setState({ ...initialAppState, ...overrides })
}
