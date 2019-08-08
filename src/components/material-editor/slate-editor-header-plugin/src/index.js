//
// Rendering
//
import H1Node from './H1Node'
import H2Node from './H2Node'

//
// Keyboard
//
import HeaderKeyboardShortcut from './HeaderKeyboardShortcut'

//
// External
//
import * as HeaderUtils from './HeaderUtils'
import HeaderButtonBar from './HeaderButtonBar'
import H1Button from './H1Button'
import H2Button from './H2Button'

const HeaderPlugin = options => ({
    onKeyDown(...args) {
        return HeaderKeyboardShortcut(...args)
    },
})

export {
    HeaderPlugin,
    H1Node,
    H2Node,
    HeaderKeyboardShortcut,
    HeaderUtils,
    HeaderButtonBar,
    H1Button,
    H2Button,
}
