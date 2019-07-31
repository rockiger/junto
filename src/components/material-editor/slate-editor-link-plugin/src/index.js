//
// Rendering
//
import LinkNode from './LinkNode'

//
// Keyboard
//
import LinkKeyboardShortcut from './LinkKeyboardShortcut'

//
// External
//
import * as LinkUtils from './LinkUtils'
import LinkButton from './LinkButton'
import DriveButton from './DriveButton'

const LinkPlugin = options => ({
    onKeyDown(...args) {
        return LinkKeyboardShortcut(...args)
    },
})

export {
    DriveButton,
    LinkPlugin,
    LinkNode,
    LinkKeyboardShortcut,
    LinkUtils,
    LinkButton,
}
