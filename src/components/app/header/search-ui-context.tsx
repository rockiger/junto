import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react'

type SearchUIContextValue = {
    searchValue: string
    setSearchValue: (value: string) => void
    isSearchFieldActive: boolean
    setIsSearchFieldActive: (value: boolean) => void
    resetSearchUI: () => void
}

const SearchUIContext = createContext<SearchUIContextValue | null>(null)

export function SearchUIProvider({ children }: { children: ReactNode }) {
    const [searchValue, setSearchValue] = useState('')
    const [isSearchFieldActive, setIsSearchFieldActive] = useState(false)

    const resetSearchUI = useCallback(() => {
        setSearchValue('')
        setIsSearchFieldActive(false)
    }, [])

    const value = useMemo(
        () => ({
            searchValue,
            setSearchValue,
            isSearchFieldActive,
            setIsSearchFieldActive,
            resetSearchUI,
        }),
        [searchValue, isSearchFieldActive, resetSearchUI],
    )

    return (
        <SearchUIContext.Provider value={value}>
            {children}
        </SearchUIContext.Provider>
    )
}

export function useSearchUI(): SearchUIContextValue {
    const context = useContext(SearchUIContext)
    if (!context) {
        throw new Error('useSearchUI must be used within SearchUIProvider')
    }
    return context
}
