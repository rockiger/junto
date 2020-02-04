//@ts-check
/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} keyboardEvent
 * @property {string} key - The name of the key.
 * @property {string} blockType - A type of a slate editor block.
 * @property {boolean} ctrlKey - Indicates whether ctrl key is pressed.
 * @property {boolean} metaKey - Indicates whether meta/command key is pressed..
 */

/**
 * Check if the Enter is pressed in a given block without any modifiers.
 * @param {string} blockType - a type of a slate editor block
 * @param {keyboardEvent} keyboardEvent - the slate keyboard event to check against
 * @return {boolean}
 */
export function isEnterWithoutControlOrCommand(blockType, keyboardEvent) {
    const { key, blockType: TBlock, ctrlKey, metaKey } = keyboardEvent
    console.log('keyboardevent', keyboardEvent)

    const result =
        key === 'Enter' && TBlock === blockType && !ctrlKey && !metaKey
    console.log('result', result)

    return result
}
