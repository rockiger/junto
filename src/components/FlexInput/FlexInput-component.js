import React from 'react'

export const FlexInputComponent = React.forwardRef((props, ref) => {
    const {
        h1Ref,
        onBlur,
        onChange,
        onKeyDown,
        placeholder,
        value,
        width,
    } = props
    return (
        <>
            <input
                className="editorInput"
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                onChange={onChange}
                placeholder={placeholder}
                ref={ref}
                style={{
                    width,
                }}
                value={value}
            />
            <h1
                ref={h1Ref}
                style={{
                    display: 'inline',
                    fontWeight: 400,
                    fontSize: 24,
                    position: 'absolute',
                    left: -101000,
                    top: -100100,
                }}
            >
                {value || placeholder}
            </h1>
            <style>{`
                .editorInput {
                    border: 1px solid transparent;
                    font: unset;
                    font-size: 1.5rem;
                    font-weight: 400;
                    padding: 0 calc(.5rem - 1px);
                }
                .editorInput:hover {
                    border-color: #dadce0;
                }
            `}</style>
        </>
    )
})
