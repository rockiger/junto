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

describe('getOverviewFileId', () => {
    const file1 = { id: '1', name: 'file1.gwiki', parents: ['f0'] }
    const file2 = { id: '2', name: 'file2.gwiki', parents: ['f2'] }
    const folder1 = { id: 'f1', name: '1', parents: ['f0'] }
    const subfile1 = { id: 's1', name: 'subfile1.gwiki', parents: ['f1'] }
    const subfile2 = {
        id: 's2',
        name: 'subfile2.gwiki',
        parents: ['f1'],
        properties: { isArchived: 'true' },
    }

    const files1 = [file1, file2]
    const files2 = [...files1, folder1]
    const files3 = [...files2, subfile1]
    const files4 = [...files2, subfile2]

    /*  test('produces null if there is no corresponding folder', () => {
        expect(getFolderId(file1.id, files1)).toBe(null)
    })

    test('produces null if there is a corresponding folder, but this folder has not any relevant children. Which means other pages the should not be archived', () => {
        expect(getFolderId(file1.id, files2)).toBe(null)
        expect(getFolderId(file1.id, files4)).toBe(null)
    })

    test('produces the id of the corresponding folder, if there is a folder and it has a child page', () => {
        expect(getFolderId(file1.id, files3)).toBe('f1')
    })
 */
    test('should work with real world values', () => {
        expect(getFolderId(sub4dPage.id, testState)).toBe(null)
        expect(getFolderId(sub3dPage.id, testState)).toBe(sub3dFolder.id)
        expect(getFolderId(sub2dPage.id, testState)).toBe(sub2dFolder.id)
        expect(getFolderId(sub1dPage.id, testState)).toBe(sub1dFolder.id)
    })
})
