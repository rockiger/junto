import { useCallback, useEffect, useRef, useState } from 'react'
import type { Key } from 'react-aria-components'

function routeExpandSignature(keys: Set<string>): string {
    return [...keys].sort().join('|')
}

export function useWikiTreeExpand(routeExpandedKeys: Set<string>): {
    expandedKeys: Set<Key>
    onExpandedChange: (keys: Set<Key>) => void
} {
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(
        () => new Set(routeExpandedKeys),
    )
    const userCollapsedKeysRef = useRef<Set<Key>>(new Set())
    const routeSignatureRef = useRef(routeExpandSignature(routeExpandedKeys))

    useEffect(() => {
        const signature = routeExpandSignature(routeExpandedKeys)
        const routeChanged = signature !== routeSignatureRef.current
        routeSignatureRef.current = signature

        if (routeChanged) {
            userCollapsedKeysRef.current = new Set()
        }

        setExpandedKeys(prev => {
            const next = new Set(prev)
            let changed = false
            for (const key of routeExpandedKeys) {
                if (
                    !userCollapsedKeysRef.current.has(key) &&
                    !next.has(key)
                ) {
                    next.add(key)
                    changed = true
                }
            }
            return changed ? next : prev
        })
    }, [routeExpandedKeys])

    const onExpandedChange = useCallback(
        (keys: Set<Key>) => {
            setExpandedKeys(prev => {
                for (const key of prev) {
                    if (
                        !keys.has(key) &&
                        routeExpandedKeys.has(String(key))
                    ) {
                        userCollapsedKeysRef.current.add(key)
                    }
                }
                for (const key of keys) {
                    userCollapsedKeysRef.current.delete(key)
                }
                return new Set(keys)
            })
        },
        [routeExpandedKeys],
    )

    return { expandedKeys, onExpandedChange }
}
