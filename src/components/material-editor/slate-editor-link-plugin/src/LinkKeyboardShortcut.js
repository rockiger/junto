import { keyboardEvent } from '../../slate-editor-utils/src'
import { insertLinkStrategy } from './LinkUtils'

const LinkKeyboardShortcut = (event, change) => {
    if (keyboardEvent.isMod(event) && event.key === 'k') {
        event.preventDefault()
        return insertLinkStrategy(change)
    }
    return
}

export default LinkKeyboardShortcut
