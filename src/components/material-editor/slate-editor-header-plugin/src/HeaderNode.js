import React from 'react'

const HeaderNode = tagName => {
    return ({ attributes, children }) => {
        const TageName = tagName
        return <TageName {...attributes}>{children}</TageName>
    }
}

export default HeaderNode
