import { getFolderId } from './SidebarTree-helper'
import {
    subTest2Page,
    subTest2Folder,
    sub1dPage,
    sub1dFolder,
    sub2dPage,
    sub2dFolder,
    sub3dPage,
    sub3dFolder,
    sub4dPage,
    testState,
} from './SidebarTree-helper-testState'

describe('getFolderId', () => {
    test('file without children should return null', () => {
        expect(getFolderId(testState[6].id, testState)).toBe(null)
    })
    test('file with children should return an id', () => {
        expect(getFolderId(testState[4].id, testState)).toBe(
            '1sdF4_JC13Kyo6XIFeOXyYjYi8s5S2pKm'
        )
    })
})
