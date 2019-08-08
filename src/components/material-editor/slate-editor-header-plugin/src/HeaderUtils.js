/**
 * Check if the any of the currently selected blocks are of `type`.
 *
 * @param {String} type
 * @return {Boolean}
 */

const isBlock = (value, type) => {
    return value.blocks.some(node => node.type === type)
}

export const isH1 = value => isBlock(value, 'heading-one')
export const isH2 = value => isBlock(value, 'heading-two')

export const headingStrategy = (change, type) => {
    const { value } = change
    const isActive = isBlock(value, type)
    return change.setBlocks(isActive ? 'paragraph' : type)
}

export const h1Strategy = change => headingStrategy(change, 'heading-one')

export const h2Strategy = change => headingStrategy(change, 'heading-two')

export const headingTypes = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
}
