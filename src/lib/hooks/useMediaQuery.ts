import { useEffect, useState } from "react"

/** Tailwind `lg` breakpoint (1024px). */
export const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)"

/**
 * Subscribes to a `matchMedia` query. Defaults to `false` on first render for SSR-safe hydration.
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === "undefined") {
            return false
        }
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        const mq = window.matchMedia(query)
        const onChange = () => setMatches(mq.matches)
        setMatches(mq.matches)
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [query])

    return matches
}

export function useIsDesktop(): boolean {
    return useMediaQuery(DESKTOP_MEDIA_QUERY)
}
