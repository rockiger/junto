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

//
// Rendering
//
import HeaderNode from './HeaderNode'

const H1Node = HeaderNode('h1')
const H2Node = HeaderNode('h2')
const H3Node = HeaderNode('h3')
const H4Node = HeaderNode('h4')
const H5Node = HeaderNode('h5')
const H6Node = HeaderNode('h6')

const HeaderPlugin = options => ({
    onKeyDown(...args) {
        return HeaderKeyboardShortcut(...args)
    },
})

export {
    HeaderPlugin,
    H1Node,
    H2Node,
    H3Node,
    H4Node,
    H5Node,
    H6Node,
    HeaderKeyboardShortcut,
    HeaderUtils,
    HeaderButtonBar,
    H1Button,
    H2Button,
}
