import { h1Strategy, h2Strategy } from './HeaderUtils'

const HeaderKeyboardShortcut = (event, change) => {
    const headings = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
    }
    // „ for neo, ( for german layout
    const h1Key = event.key === '1'
    const macH1 = event.metaKey && event.altKey && h1Key
    const winH1 = event.ctrlKey && event.altKey && h1Key
    const isH1 = macH1 || winH1

    console.log(
        'event:',
        event.shiftKey,
        event.altKey,
        event.metaKey,
        event.key,
        event.keyCode
    )

    if (isH1) return h1Strategy(change)

    // „ for neo, ( for german layout
    const h2Key = event.key === '2'
    const macH2 = event.metalKey && event.altKey && h2Key
    const winH2 = event.ctrlKey && event.altKey && h2Key
    const isH2 = macH2 || winH2
    if (isH2) return h2Strategy(change)

    return
}

export default HeaderKeyboardShortcut
