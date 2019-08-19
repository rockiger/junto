import { headingTypes, headingStrategy } from './HeaderUtils'

const HeaderKeyboardShortcut = (event, change) => {
    // „ for neo, ( for german layout
    const headingType = headingTypes[event.key]
    const mac = event.metaKey && event.altKey && headingType
    const win = event.ctrlKey && event.altKey && headingType
    const isHeading = mac || win

    if (isHeading) return headingStrategy(change, `heading-${headingType}`)

    return
}

export default HeaderKeyboardShortcut
