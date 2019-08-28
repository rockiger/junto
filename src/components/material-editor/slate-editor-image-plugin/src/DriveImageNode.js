import React, { Component, useState } from 'react'
import classnames from 'classnames'

import FileImageOutlineIcon from 'mdi-react/FileImageOutlineIcon'
import { THEME } from '../../../../lib/constants'
import Spinner from '../../../spinner'

// FIXME: Needs to handle assets files to work with SSR
if (require('exenv').canUseDOM) require('./ImageNode.css')

const ImageNode = ({ node, attributes, readOnly, isSelected, children }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <>
            {!isLoaded ? (
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#f1f3f4',
                        display: 'flex',
                        height: 320,
                        width: 480,
                    }}
                >
                    <Spinner style={{ margin: '0 auto' }}>
                        <FileImageOutlineIcon
                            size={120}
                            style={{
                                color: THEME.palette.grey.foreground,
                                margin: '0 auto',
                            }}
                        />
                    </Spinner>
                </div>
            ) : null}
            <div
                className={classnames('image-node--container', {
                    readonly: readOnly,
                })}
            >
                {children}
                <img
                    {...attributes}
                    alt={node.data.get('title')}
                    className={`image-node ${!readOnly &&
                        isSelected &&
                        'selected'}`}
                    onLoad={() => setIsLoaded(true)}
                    role="presentation"
                    src={node.data.get('src')}
                    title={node.data.get('title')}
                    style={{
                        visibility: !isLoaded ? 'hidden' : 'visible',
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '20em',
                        boxShadow:
                            isSelected && !readOnly
                                ? '0 0 0 1px #4285f4'
                                : 'none',
                    }}
                />
            </div>
        </>
    )
}

export default ImageNode
