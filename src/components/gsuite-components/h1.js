//@ts-check
import React from 'react'
import clsx from 'clsx'

export { H1 }

export default function H1({ children, ...restProps }) {
    return (
        <>
            <h1
                className={clsx('gsuiteH1eurni', restProps.className)}
                {...restProps}
            >
                {children}
            </h1>
            <style>{`
                    .gsuiteH1eurni {
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .5rem;
                    }</>
                `}</style>
        </>
    )
}
