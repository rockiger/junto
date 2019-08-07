import { strikethroughMarkStrategy } from './StrikethroughUtils'

const StrikethroughKeyboardShortcut = (event, change) => {
    const key = event.key === 'S'
    const mac = event.metaKey && event.shiftKey && key
    const win = event.shiftKey && event.ctrlKey && key

    console.log(
        'event:',
        event.shiftKey,
        event.altKey,
        event.metaKey,
        event.key
    )
    if (mac || win) return strikethroughMarkStrategy(change)
    return
}

export default StrikethroughKeyboardShortcut
