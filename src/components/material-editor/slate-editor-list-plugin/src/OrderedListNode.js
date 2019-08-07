import React from 'react'

const OrderedListNode = ({ attributes, children }) => (
    <ol style={{ paddingLeft: '1.5rem' }} {...attributes}>
        {children}
    </ol>
)

export default OrderedListNode
