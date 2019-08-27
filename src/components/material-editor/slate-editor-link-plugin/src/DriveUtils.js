import { EXT } from '../../../../lib/constants'
import { getTitleFromFileName } from '../../../../lib/helper'

export const httpPreffixStrategy = href =>
    href.search('https?://') >= 0 ? href : `http://${href}`
export const hasLinks = value =>
    value.inlines.some(inline => inline.type === 'drive-link')
export const getLink = value =>
    value.inlines.filter(inline => inline.type === 'drive-link').first()
export const createLink = data => ({ type: 'drive-link', data })
export const hasMultiBlocks = value => value.blocks.size > 1

export const unlink = change => change.unwrapInline('drive-link').focus()
export const removeNodeByKey = (ky, change) => change.removeNodeByKey(ky)

export const updateLinkStrategy = ({
    change,
    data: { title, href, text, target },
}) => {
    const { value } = change
    const { selection } = value

    if (selection.isCollapsed) {
        change.moveAnchorTo(0).moveFocusTo(text && text.length)
    }

    change.insertText(text).setInlines({
        type: 'drive-link',
        data: { title, href, text, target },
    })

    return change
}

export const insertLinkStrategy = (change, doc) => {
    const { value } = change
    const { selection } = value
    const internal = doc.name.endsWith(EXT)
    const name = internal ? getTitleFromFileName(doc.name) : doc.name
    console.log('text:', doc.name)
    if (hasMultiBlocks(value)) {
        console.info('[SlateJS][LinkPlugin] has multiple blocks on selection')
    } else if (selection.isCollapsed && !hasLinks(value)) {
        console.info(
            '[SlateJS][LinkPlugin] selection collapsed, w/o links on selection'
        )
        change
            .insertText(name)
            .moveFocusBackward(name.length)
            .wrapInline(
                createLink({
                    iconUrl: doc.iconUrl,
                    id: doc.id,
                    internal: internal,
                    href: doc.url,
                    name: doc.name,
                    target: '_blank',
                })
            )
            .moveFocusForward(doc.name.length)
            .focus()
        console.log(change)
    }

    return change
}
