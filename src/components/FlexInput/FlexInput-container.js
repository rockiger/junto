import React, { useEffect, useRef, useState } from 'react'
import { FlexInputComponent } from './FlexInput-component'

export const FlexInput = React.forwardRef((props, ref) => {
    const { id = '', onBlur, onChange, placeholder, value } = props
    const [width, setWidth] = useState()
    const h1Ref = useRef(null)

    useEffect(() => {
        const w = h1Ref.current ? h1Ref.current.offsetWidth * 0.8 : 16
        const spaceOffset = value?.slice(-1) === ' ' ? 8 : 0
        setWidth(w + 17 + spaceOffset)
    }, [h1Ref, value])

    return (
        <FlexInputComponent
            h1Ref={h1Ref}
            id={id}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
            value={value}
            width={width}
        />
    )
})
