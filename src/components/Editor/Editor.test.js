import { convertFilesToAutocompletItems } from './Editor-helper'

describe('Editor Helpers', () => {
    test('convertFilesToAutocompleItems', () => {
        expect(convertFilesToAutocompletItems([])).toEqual([])
        const result = convertFilesToAutocompletItems([
            { id: 'id', name: 'name.gwiki' },
        ])[0]
        expect(result.href).toBe('/page/id')
        expect(result.id).toBe('id')
        expect(typeof result.icon).toBe('function')
        expect(result.name).toBe('name')
    })
})
