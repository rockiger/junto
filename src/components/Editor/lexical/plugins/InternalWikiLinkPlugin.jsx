import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { parseWikiPageId } from '../lib/classifyLinkUrl'

function getWikiPageIdFromAnchor(anchor) {
    if (anchor.dataset.wikiPageId) {
        return anchor.dataset.wikiPageId
    }
    return parseWikiPageId(anchor.getAttribute('href') || '')
}

/**
 * SPA navigation for internal `/page/{id}` links via TanStack Router.
 * Lexical renders plain `<a>` elements; clicks are intercepted so no new tab opens.
 */
export default function InternalWikiLinkPlugin({ readOnly }) {
    const [editor] = useLexicalComposerContext()
    const router = useRouter()

    useEffect(() => {
        const onClick = event => {
            if (event.defaultPrevented) return
            if (event.button !== 0) return
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return
            }

            const target = event.target
            if (!(target instanceof Element)) return

            const anchor = target.closest('a')
            if (!anchor) return

            const pageId = getWikiPageIdFromAnchor(anchor)
            if (!pageId) return

            event.preventDefault()
            event.stopPropagation()

            if (readOnly) {
                router.navigate({ to: '/page/$id', params: { id: pageId } })
            }
        }

        const attach = rootElement => {
            rootElement.addEventListener('click', onClick, true)
        }

        const detach = rootElement => {
            rootElement.removeEventListener('click', onClick, true)
        }

        let attachedRoot = editor.getRootElement()
        if (attachedRoot) {
            attach(attachedRoot)
        }

        const unregisterRootListener = editor.registerRootListener(
            (nextRoot, prevRoot) => {
                if (prevRoot) detach(prevRoot)
                if (nextRoot) attach(nextRoot)
                attachedRoot = nextRoot
            }
        )

        return () => {
            unregisterRootListener()
            if (attachedRoot) detach(attachedRoot)
        }
    }, [editor, readOnly, router])

    return null
}
