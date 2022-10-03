import React from 'react'

export const FlexInputComponent = React.forwardRef((props, ref) => {
    const {
        h1Ref,
        id,
        onBlur,
        onChange,
        onKeyDown,
        placeholder,
        value,
        width,
    } = props
    return (
        <>
            <div style={{ padding: '0.25rem 0' }}>
                <input
                    className="flexInput"
                    id={id}
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
            </div>
            <div
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
            </div>
            <style>{`
                .flexInput {
                    border: 1px solid transparent;
                    display: inline-flex;
                    font: unset;
                    font-size: 1.2rem;
                    font-weight: 400;
                    letter-spacing: normal;
                    padding: 0 .5rem;
                    margin: 0 -.5rem;
                }
                .flexInput:hover {
                    border-color: #dadce0;
                }
            `}</style>
        </>
    )
})
