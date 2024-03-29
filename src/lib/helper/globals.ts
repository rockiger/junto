/**
 * This file provides objects that are added to the gobal namespace.
 * Right now it is only lodash and the thread helper function to extend
 * javascript
 */
import lodash from 'lodash'

/**
 * Evaluates the given forms in order, the result of each form will be added last or first in the next form.
 * @example thread(
 *             arr,
 *             fn1,
 *             [fn2, arg2]
 *          )
 * @param {'->' | '-->'} threadType --> for thread last and -> for thread first
 * @param {*} initialValue
 * @param  {...any} forms
 * @returns any
 */
const threadBase = (threadType, initialValue, ...forms) => {
    return forms.reduce((acc, curVal) => {
        if (Array.isArray(curVal)) {
            const [head, ...rest] = curVal
            return threadType === '->'
                ? head.apply(this, [acc, ...rest])
                : head.apply(this, [...rest, acc])
        } else {
            return curVal(acc)
        }
    }, initialValue)
}

export const thread = (initialValue, ...forms) =>
    threadBase('->', initialValue, ...forms)

/**
 * Log a value to the console and return it again. Useful for logging a provisional result from the thread function.
 * @param {any} x the value to log
 * @return {any} the given value x
 */
export const trace = x => {
    console.log(x)
    return x
}

/**
 * Check if a collection is not empty. E.g. !_.isEmpty(col)
 * @param {any} col
 * @returns {boolean}
 */
export const isNotEmpty = col => !_.isEmpty(col)

lodash.mixin({ isNotEmpty, thread, trace })

declare global {
    var _: typeof lodash
}

const _ = { ...lodash, thread, trace }
export default _
