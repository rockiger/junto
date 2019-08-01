import React from 'react'

import PencilOffOutlineIcon from 'mdi-react/PencilOffOutlineIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from '../../slate-editor-components/src'

const ToggleReadOnlyButton = ({
    value,
    outerState: { readOnly },
    onChange,
    changeState,
    className,
    save,
    style,
    type,
}) => (
    <Button
        className={className}
        style={style}
        type={type}
        onClick={e => {
            if (!readOnly) save()
            changeState({ value, readOnly: !readOnly })
            const editor = document.getElementsByClassName('editor--content')[0]
                .firstElementChild
            console.log(editor)
            setTimeout(() => {
                editor.focus()
                editor.click()
            }, 100)
        }}
        readOnly={readOnly}
    >
        {readOnly ? <PencilOutlineIcon /> : <PencilOffOutlineIcon />}
    </Button>
)

export default ToggleReadOnlyButton
