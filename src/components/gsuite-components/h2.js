//@ts-check
import React from 'react'
import clsx from 'clsx'

export { H2 }

export default function H2({ children, ...restProps }) {
    return (
        <>
            <h2
                className={clsx('gsuiteH2eurni', restProps.className)}
                {...restProps}
            >
                {children}
            </h2>
            <style>{`
                    .gsuiteH2eurni {
                        font-size: 1.2rem;
                        font-weight: 400;
                        margin: 0;
                    }</>
                `}</style>
        </>
    )
}
