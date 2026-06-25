import type { NavigateOptions } from '@tanstack/react-router'

type NavigateFn = (options: NavigateOptions) => void | Promise<void>

/** Navigate to the deeplinkable search results route. */
export function navigateToSearch(navigate: NavigateFn, searchValue: string) {
    const trimmed = searchValue.trim()
    void navigate({
        to: '/search',
        search: { q: trimmed },
    })
}
