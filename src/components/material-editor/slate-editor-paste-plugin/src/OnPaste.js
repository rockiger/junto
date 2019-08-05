import { getEventTransfer } from 'slate-react'

import serializer from './PasteSerializer'

/**
 * On paste, deserialize the HTML and then insert the fragment.
 *
 * @param {Event} event
 * @param {Change} change
 */

const onPaste = (event, change) => {
    const transfer = getEventTransfer(event)
    if (transfer.type != 'html') return
    const { document } = serializer.deserialize(transfer.html)
    change.insertFragment(document)
    return true
}

export default onPaste
