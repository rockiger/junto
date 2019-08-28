//
// Rendering
//
import ImageNode from './ImageNode'
import ImageLinkNode from './ImageLinkNode'

//
// Keyboard
//
import ImageKeyboardShortcut from './ImageKeyboardShortcut'

//
// External
//
import * as ImageUtils from './ImageUtils'
import ImageButton from './ImageButton'

import DriveImageButton from './DriveImageButton'
import DriveImageNode from './DriveImageNode'

const ImagePlugin = options => ({
    onKeyDown(...args) {
        return ImageKeyboardShortcut(...args)
    },
})

export {
    DriveImageButton,
    DriveImageNode,
    ImagePlugin,
    ImageNode,
    ImageLinkNode,
    ImageKeyboardShortcut,
    ImageUtils,
    ImageButton,
}
