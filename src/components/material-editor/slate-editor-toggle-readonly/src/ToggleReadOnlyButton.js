import React from 'react'

import PencilOffOutlineIcon from 'mdi-react/PencilOffOutlineIcon'
import PencilOutlineIcon from 'mdi-react/PencilOutlineIcon'

import { Button } from '../../slate-editor-components/src'
import { platform } from '../../slate-editor-utils/src'

const ToggleReadOnlyButton = props => {
    const {
        value,
        outerState: { readOnly },
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
            title={
                readOnly ? `Edit (e)` : `Save (${platform.controlKey()}+Enter)`
            }
        >
            {readOnly ? <PencilOutlineIcon /> : <PencilOffOutlineIcon />}
        </Button>
    )
}

export default ToggleReadOnlyButton
