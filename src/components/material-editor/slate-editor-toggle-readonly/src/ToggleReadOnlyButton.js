import React from 'react'

import PencilOffOutlineIcon from 'mdi-react/PencilOffOutlineIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from '../../slate-editor-components/src'

const ToggleReadOnlyButton = props => {
    const {
        value,
        outerState: { readOnly },
        onChange,
        changeState,
        className,
        save,
        style,
        type,
    } = props
    console.log(props)
    return (
        <Button
            className={className}
            style={style}
            type={type}
            onClick={ev => {
                if (!readOnly) save()
                changeState({ value, readOnly: !readOnly })
                if (readOnly) window.editorRef.current.focus()
            }}
            readOnly={readOnly}
        >
            {readOnly ? <PencilOutlineIcon /> : <PencilOffOutlineIcon />}
        </Button>
    )
}

export default ToggleReadOnlyButton
