import type { NavigateOptions } from '@tanstack/react-router'

type NavigateFn = (options: NavigateOptions) => void | Promise<void>

type SetSearchGlobals = {
    setSearchValue: (value: string) => void
    setSearchTerm: (value: string) => void
    setIsSearchFieldActive: (value: boolean) => void
}

/** Sync global search state and navigate to the deeplinkable search results route. */
export function navigateToSearch(
    navigate: NavigateFn,
    searchValue: string,
    globals: SetSearchGlobals,
) {
    const trimmed = searchValue.trim()
    globals.setSearchValue(trimmed)
    globals.setSearchTerm(trimmed)
    globals.setIsSearchFieldActive(false)
    void navigate({
        to: '/search',
        search: { q: trimmed },
    })
}
