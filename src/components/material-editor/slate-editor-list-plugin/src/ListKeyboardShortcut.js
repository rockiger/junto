import {
    unorderedListStrategy,
    orderedListStrategy,
    increaseListDepthStrategy,
    decreaseListDepthStrategy,
} from './ListUtils'

const ListKeyboardShortcut = (event, change) => {
    //
    // Behaviour to increase or decrease depth of the list.
    //
    if (event.key === 'Tab') {
        event.preventDefault()
        if (event.shiftKey) return decreaseListDepthStrategy(change)
        return increaseListDepthStrategy(change)
    }

    // „ for neo, ( for german layout
    const unorderedKey =
        event.key === '8' || event.key === '„' || event.key === '('
    const macUnordered = event.metaKey && event.shiftKey && unorderedKey
    const winUnordered = event.ctrlKey && event.shiftKey && unorderedKey
    const isUnordered = macUnordered || winUnordered

    console.log(
        'event:',
        event.shiftKey,
        event.altKey,
        event.metaKey,
        event.key,
        event.keyCode
    )

    if (isUnordered) return unorderedListStrategy(change)

    // „ for neo, ( for german layout
    const orderedKey =
        event.key === '7' || event.key === '€' || event.key === '/'
    const macOrdered = event.metalKey && event.shiftKey && orderedKey
    const winOrdered = event.ctrlKey && event.shiftKey && orderedKey
    const isOrdered = macOrdered || winOrdered
    if (isOrdered) return orderedListStrategy(change)

    return
}

export default ListKeyboardShortcut
