import React from 'react'

const UnorderedListNode = ({ attributes, children }) => (
    <ul style={{ paddingLeft: '1.5rem' }} {...attributes}>
        {children}
    </ul>
)

export default UnorderedListNode
