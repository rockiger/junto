//@ts-check
import { isEnterWithoutControlOrCommand } from './keyboard-utils'

describe('keyboard-utils', () => {
    test('isEnterWithoutControlOrCommand', () => {
        const bt1 = 'code'
        const bt2 = 'quatsch'
        const kbEv1 = {
            key: 'Enter',
            blockType: 'code',
            ctrlKey: false,
            metaKey: false,
        }
        const kbEv2 = {
            key: 'Enter',
            blockType: 'code',
            ctrlKey: true,
            metaKey: false,
        }
        expect(isEnterWithoutControlOrCommand(bt1, kbEv1)).toBe(true)
        expect(isEnterWithoutControlOrCommand(bt2, kbEv1)).toBe(false)
        expect(isEnterWithoutControlOrCommand(bt1, kbEv2)).toBe(false)
    })
})
