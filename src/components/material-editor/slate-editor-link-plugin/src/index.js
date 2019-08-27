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

import * as DriveUtils from './LinkUtils'
import DriveButton from './DriveButton'
import DriveLinkNode from './DriveLinkNode'

const LinkPlugin = options => ({
    onKeyDown(...args) {
        return LinkKeyboardShortcut(...args)
    },
})

export {
    DriveButton,
    DriveLinkNode,
    DriveUtils,
    LinkPlugin,
    LinkNode,
    LinkKeyboardShortcut,
    LinkUtils,
    LinkButton,
}
